import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const db = SQLite.openDatabase('royalStudyPlan.db');
const { width, height } = Dimensions.get('window');

const CURRICULUM = [
  {
    day: 1,
    phase: 'PHASE 1',
    subjects: [
      {
        subject: 'Physics',
        chapter: 'Units & Dimensions',
        topics: 'units, dimensions, significant figures, errors',
        color: '#3b82f6',
      },
      {
        subject: 'Chemistry',
        chapter: 'Mole Concept-I',
        topics: 'mole, Avogadro number, molar mass',
        color: '#10b981',
      },
      {
        subject: 'Maths',
        chapter: 'Sets',
        topics: 'operations, Venn diagrams',
        color: '#a855f7',
      },
    ],
  },
  {
    day: 2,
    phase: 'PHASE 1',
    subjects: [
      {
        subject: 'Physics',
        chapter: 'Error Analysis',
        topics: 'absolute, relative, percentage errors',
        color: '#3b82f6',
      },
      {
        subject: 'Chemistry',
        chapter: 'Mole Concept-II',
        topics: 'stoichiometry, limiting reagent',
        color: '#10b981',
      },
      {
        subject: 'Maths',
        chapter: 'Relations',
        topics: 'types of relations',
        color: '#a855f7',
      },
    ],
  },
  // Add more days as needed (up to 60)
];

const CHECKLIST_ITEMS = [
  'Theory completed',
  'Short notes made (1–2 pages)',
  '15–20 basic questions solved',
  'Formulas / reactions memorized',
  'Doubts marked',
];

const SubjectCard = ({ subject, onPress, isExpanded }) => {
  const [checklist, setChecklist] = useState([]);
  const [progress, setProgress] = useState('0/5');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM checklist WHERE subject_id = ?',
        [subject.id],
        (_, result) => {
          const items = result.rows._array;
          setChecklist(items);
          const completed = items.filter(i => i.completed === 1).length;
          setProgress(`${completed}/${items.length}`);
        }
      );
    });
  }, [subject.id]);

  const toggleItem = (checklistId) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT completed FROM checklist WHERE id = ?',
        [checklistId],
        (_, result) => {
          const newStatus = result.rows._array[0].completed === 0 ? 1 : 0;
          tx.executeSql(
            'UPDATE checklist SET completed = ? WHERE id = ?',
            [newStatus, checklistId],
            () => {
              // Refresh
              db.transaction(tx2 => {
                tx2.executeSql(
                  'SELECT * FROM checklist WHERE subject_id = ?',
                  [subject.id],
                  (_, result2) => {
                    const items = result2.rows._array;
                    setChecklist(items);
                    const completed = items.filter(i => i.completed === 1).length;
                    setProgress(`${completed}/${items.length}`);
                  }
                );
              });
            }
          );
        }
      );
    });
  };

  return (
    <TouchableOpacity
      style={[styles.subjectCard, { borderLeftColor: subject.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.subjectHeader}>
        <View style={styles.subjectTitleContainer}>
          <View style={styles.subjectDot} style={{ backgroundColor: subject.color }}>
            <MaterialCommunityIcons
              name="star"
              size={10}
              color="white"
            />
          </View>
          <Text style={styles.subjectName}>{subject.subject}</Text>
        </View>
        <Text style={styles.progressBadge}>{progress}</Text>
      </View>

      <Text style={styles.chapterName}>{subject.chapter}</Text>
      <Text style={styles.topicsText}>{subject.topics}</Text>

      {isExpanded && (
        <View style={styles.checklistContainer}>
          {checklist.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checklistItem}
              onPress={() => toggleItem(item.id)}
            >
              <MaterialCommunityIcons
                name={
                  item.completed === 1
                    ? 'checkbox-marked-circle'
                    : 'checkbox-blank-circle-outline'
                }
                size={20}
                color={item.completed === 1 ? subject.color : '#4b5563'}
              />
              <Text
                style={[
                  styles.checklistItemText,
                  item.completed === 1 && styles.checklistItemCompleted,
                ]}
              >
                {String(index + 1).padStart(2, '0')} {item.item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function MainScreen() {
  const [currentDay, setCurrentDay] = useState(1);
  const [dayData, setDayData] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [totalStats, setTotalStats] = useState({ done: 0, left: 60 });

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    loadDayData(currentDay);
  }, [currentDay]);

  const initializeData = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM checklist');
      tx.executeSql('DELETE FROM subjects');
      tx.executeSql('DELETE FROM days');

      CURRICULUM.forEach(dayItem => {
        tx.executeSql(
          'INSERT INTO days (day_number, phase) VALUES (?, ?)',
          [dayItem.day, dayItem.phase],
          (_, result) => {
            const dayId = result.insertId;
            dayItem.subjects.forEach(subjectItem => {
              tx.executeSql(
                'INSERT INTO subjects (day_id, subject, chapter, topics, color) VALUES (?, ?, ?, ?, ?)',
                [dayId, subjectItem.subject, subjectItem.chapter, subjectItem.topics, subjectItem.color],
                (_, subResult) => {
                  const subjectId = subResult.insertId;
                  CHECKLIST_ITEMS.forEach(item => {
                    tx.executeSql(
                      'INSERT INTO checklist (subject_id, item) VALUES (?, ?)',
                      [subjectId, item]
                    );
                  });
                }
              );
            });
          }
        );
      });
    });
  };

  const loadDayData = (dayNumber) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM days WHERE day_number = ?',
        [dayNumber],
        (_, result) => {
          if (result.rows.length > 0) {
            const day = result.rows._array[0];
            tx.executeSql(
              'SELECT * FROM subjects WHERE day_id = ?',
              [day.id],
              (_, subResult) => {
                const subjects = subResult.rows._array;
                let loadedSubjects = [];

                subjects.forEach(subject => {
                  tx.executeSql(
                    'SELECT * FROM checklist WHERE subject_id = ?',
                    [subject.id],
                    (_, checklistResult) => {
                      const checklist = checklistResult.rows._array;
                      loadedSubjects.push({
                        ...subject,
                        checklist,
                      });

                      if (loadedSubjects.length === subjects.length) {
                        setDayData({
                          ...day,
                          subjects: loadedSubjects,
                        });
                      }
                    }
                  );
                });
              }
            );
          }
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>JEE ADVANCED • 60-DAY PREPARATION</Text>
          <Text style={styles.headerTitle}>STUDY PLAN</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>DONE</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>60</Text>
            <Text style={styles.statLabel}>LEFT</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>—</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
        </View>
      </View>

      {/* Subjects Filter */}
      <View style={styles.subjectsFilter}>
        <View style={styles.filterDot} style={{ backgroundColor: '#3b82f6' }} />
        <Text style={styles.filterText}>PHYSICS</Text>
        <View style={styles.filterDot} style={{ backgroundColor: '#10b981' }} />
        <Text style={styles.filterText}>CHEMISTRY</Text>
        <View style={styles.filterDot} style={{ backgroundColor: '#a855f7' }} />
        <Text style={styles.filterText}>MATHEMATICS</Text>
      </View>

      <ScrollView style={styles.content} horizontal showsHorizontalScrollIndicator={false}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.phaseButton}>
            <Text style={styles.phaseButtonText}>PHASE I</Text>
          </TouchableOpacity>
          <Text style={styles.phaseLabel}>PHASE II</Text>

          <View style={styles.dayGrid}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  currentDay === day && styles.dayButtonActive,
                ]}
                onPress={() => {
                  setCurrentDay(day);
                  setExpandedSubject(null);
                }}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    currentDay === day && styles.dayButtonTextActive,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {dayData && (
            <>
              {/* Day Header Card */}
              <View style={styles.dayHeaderCard}>
                <Text style={styles.dayHeaderSubtitle}>
                  — {dayData.phase} • CLASS 11 FOUNDATION
                </Text>
                <Text style={styles.dayHeaderTitle}>DAY {dayData.day_number}</Text>
                <View style={styles.tasksInfo}>
                  <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={16} color="#d4af37" />
                  <Text style={styles.tasksText}>0 / 15 tasks</Text>
                </View>
              </View>

              {/* Subject Tags */}
              <View style={styles.subjectTags}>
                {dayData.subjects.map((subject, idx) => (
                  <View key={idx} style={styles.subjectTag}>
                    <View style={[styles.tagDot, { backgroundColor: subject.color }]} />
                    <Text style={styles.tagText}>{subject.subject}</Text>
                    <Text style={styles.tagProgress}>• 0/5</Text>
                  </View>
                ))}
              </View>

              {/* Subject Cards */}
              {dayData.subjects.map((subject, idx) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  isExpanded={expandedSubject === subject.id}
                  onPress={() =>
                    setExpandedSubject(
                      expandedSubject === subject.id ? null : subject.id
                    )
                  }
                />
              ))}

              <View style={styles.spacer} />
            </>
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1219',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#d4af37',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    borderWidth: 1,
    borderColor: '#3b4252',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d4af37',
  },
  statLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 2,
  },
  subjectsFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3b4252',
    gap: 12,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterText: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
    letterSpacing: 1,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  sidebar: {
    width: 280,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRightWidth: 1,
    borderRightColor: '#3b4252',
  },
  phaseButton: {
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  phaseButtonText: {
    color: '#d4af37',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  phaseLabel: {
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 16,
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dayButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b4252',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#d4af37',
    borderColor: '#d4af37',
  },
  dayButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: '#0f1219',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dayHeaderCard: {
    borderWidth: 1,
    borderColor: '#3b5998',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 20,
  },
  dayHeaderSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  dayHeaderTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 8,
  },
  tasksInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  tasksText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  subjectTags: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  subjectTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b4252',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tagProgress: {
    fontSize: 10,
    color: '#6b7280',
  },
  subjectCard: {
    borderWidth: 1,
    borderColor: '#3b4252',
    borderLeftWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subjectDot: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d4af37',
    letterSpacing: 0.5,
  },
  progressBadge: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  chapterName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  topicsText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  checklistContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#3b4252',
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checklistItemText: {
    fontSize: 13,
    color: '#9ca3af',
    flex: 1,
  },
  checklistItemCompleted: {
    color: '#10b981',
    textDecorationLine: 'line-through',
  },
  spacer: {
    height: 40,
  },
});
