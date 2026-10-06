import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const tiles = {
  one: { label: '1', color: '#1D7BF2' },
  two: { label: '2', color: '#F53235' },
  three: { label: '3', color: '#FFD21A', textColor: '#000000' },
  four: { label: '4', color: '#2BB36A' },
  five: { label: '5', color: '#7B3BDA' },
  six: { label: '6', color: '#FF760D' },
};

function NumberTile({ tile, onPress }) {
  return (
    <Pressable
      accessibilityLabel={`Ô số ${tile.label}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: tile.color },
        pressed && styles.tilePressed,
      ]}
    >
      <Text style={[styles.tileNumber, { color: tile.textColor || '#FFFFFF' }]}>
        {tile.label}
      </Text>
    </Pressable>
  );
}

function Screen1({
  userName,
  studentId,
  onChangeUserName,
  onChangeStudentId,
  onNavigate,
}) {
  const [selectedTile, setSelectedTile] = useState(null);
  const [errors, setErrors] = useState({});
  const userNameRef = useRef(null);
  const studentIdRef = useRef(null);

  const handleSubmit = () => {
    const student = {
      userName: userName.trim(),
      studentId: studentId.trim(),
    };
    const nextErrors = {};

    if (!student.userName) {
      nextErrors.userName = 'Vui lòng nhập UserName.';
    }
    if (!student.studentId) {
      nextErrors.studentId = 'Vui lòng nhập MSSV.';
    }

    setErrors(nextErrors);

    if (nextErrors.userName || nextErrors.studentId) {
      (nextErrors.userName ? userNameRef : studentIdRef).current?.focus();
      return;
    }

    Keyboard.dismiss();
    onNavigate(student);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.board}>
          <View style={styles.topRow}>
            <NumberTile tile={tiles.one} onPress={() => setSelectedTile('1')} />
            <NumberTile tile={tiles.two} onPress={() => setSelectedTile('2')} />
          </View>

          <View style={styles.middleRow}>
            <View style={styles.smallTile}>
              <NumberTile
                tile={tiles.three}
                onPress={() => setSelectedTile('3')}
              />
            </View>
            <View style={styles.smallTile}>
              <NumberTile
                tile={tiles.four}
                onPress={() => setSelectedTile('4')}
              />
            </View>
            <View style={styles.wideTile}>
              <NumberTile
                tile={tiles.five}
                onPress={() => setSelectedTile('5')}
              />
            </View>
          </View>

          <View style={styles.bottomRow}>
            <NumberTile tile={tiles.six} onPress={() => setSelectedTile('6')} />
          </View>
        </View>

        <View style={styles.studentForm}>
          {selectedTile ? (
            <Text style={styles.selectionHint}>Đã chọn ô {selectedTile}</Text>
          ) : null}
          <Text style={styles.formTitle}>Nhập thông tin sinh viên</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>UserName</Text>
            <TextInput
              ref={userNameRef}
              accessibilityLabel="UserName"
              accessibilityHint={errors.userName || 'Nhập tên sinh viên'}
              style={[styles.input, errors.userName && styles.inputError]}
              value={userName}
              onChangeText={(value) => {
                onChangeUserName(value);
                setErrors((current) => ({ ...current, userName: '' }));
              }}
              placeholder="Enter your name"
              placeholderTextColor="#757575"
              autoCapitalize="words"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => studentIdRef.current?.focus()}
            />
            {errors.userName ? (
              <Text accessibilityLiveRegion="polite" style={styles.errorText}>
                {errors.userName}
              </Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>MSSV</Text>
            <TextInput
              ref={studentIdRef}
              accessibilityLabel="MSSV"
              accessibilityHint={errors.studentId || 'Nhập mã số sinh viên'}
              style={[styles.input, errors.studentId && styles.inputError]}
              value={studentId}
              onChangeText={(value) => {
                onChangeStudentId(value);
                setErrors((current) => ({ ...current, studentId: '' }));
              }}
              placeholder="Enter your student ID"
              placeholderTextColor="#757575"
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            {errors.studentId ? (
              <Text accessibilityLiveRegion="polite" style={styles.errorText}>
                {errors.studentId}
              </Text>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Click me"
            accessibilityHint="Hiển thị thông tin sinh viên ở Screen 2"
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.tilePressed,
            ]}
          >
            <Text style={styles.submitButtonText}>Click me</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Screen2({ student, onBack }) {
  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.detailsScreen}>
        <View style={styles.studentDetails}>
          <Text accessibilityRole="header" style={styles.detailsTitle}>
            Screen 2
          </Text>
          <Text style={styles.detailText}>Name: {student.userName}</Text>
          <Text style={styles.detailText}>Student ID: {student.studentId}</Text>
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quay lại Screen 1"
        onPress={onBack}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.tilePressed,
        ]}
      >
        <View accessible={false} style={styles.backArrow}>
          <View style={styles.arrowShaft} />
          <View style={styles.arrowHead} />
        </View>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('Screen1');
  const [userName, setUserName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (screen !== 'Screen2') {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setScreen('Screen1');
      return true;
    });

    return () => subscription.remove();
  }, [screen]);

  const openScreen2 = (params) => {
    setStudent(params);
    setScreen('Screen2');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        {screen === 'Screen1' ? (
          <Screen1
            userName={userName}
            studentId={studentId}
            onChangeUserName={setUserName}
            onChangeStudentId={setStudentId}
            onNavigate={openScreen2}
          />
        ) : (
          <Screen2 student={student} onBack={() => setScreen('Screen1')} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
  },
  screen: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  board: {
    width: '100%',
    gap: 10,
  },
  topRow: {
    width: '100%',
    aspectRatio: 2.5,
    flexDirection: 'row',
    gap: 10,
  },
  middleRow: {
    width: '100%',
    aspectRatio: 2.5,
    flexDirection: 'row',
    gap: 10,
  },
  bottomRow: {
    width: '100%',
    aspectRatio: 3,
  },
  smallTile: {
    flex: 1,
  },
  wideTile: {
    flex: 2,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  tilePressed: {
    opacity: 0.72,
  },
  tileNumber: {
    fontSize: 56,
    fontWeight: '700',
    lineHeight: 64,
  },
  studentForm: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 32,
  },
  formTitle: {
    color: '#404040',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#404040',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#909090',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#202020',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#B42318',
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    marginTop: 4,
  },
  submitButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: '#FF760D',
  },
  submitButtonText: {
    color: '#202020',
    fontSize: 16,
    fontWeight: '600',
  },
  selectionHint: {
    color: '#606060',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  detailsScreen: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 72,
  },
  studentDetails: {
    alignItems: 'center',
  },
  detailsTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailText: {
    color: '#404040',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  arrowShaft: {
    position: 'absolute',
    left: 2,
    top: 11,
    width: 22,
    height: 3,
    backgroundColor: '#000000',
  },
  arrowHead: {
    position: 'absolute',
    left: 2,
    top: 6,
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#000000',
    transform: [{ rotate: '45deg' }],
  },
});
