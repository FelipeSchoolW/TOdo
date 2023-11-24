import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Load tasks from AsyncStorage on component mount
    loadTasks();
  }, []);

  const addTask = async () => {
    if (task.trim() !== '') {
      // Add task to the list
      const newTasks = [...tasks, { id: Date.now().toString(), text: task }];
      setTasks(newTasks);
      // Save tasks to AsyncStorage
      await saveTasks(newTasks);
      // Clear the input field
      setTask('');
    }
  };

  const removeTask = async (taskId) => {
    // Remove task from the list
    const newTasks = tasks.filter((item) => item.id !== taskId);
    setTasks(newTasks);
    // Save updated tasks to AsyncStorage
    await saveTasks(newTasks);
  };

  const saveTasks = async (tasks) => {
    try {
      const jsonTasks = JSON.stringify(tasks);
      await AsyncStorage.setItem('tasks', jsonTasks);
    } catch (error) {
      console.error('Error saving tasks', error);
    }
  };

  const loadTasks = async () => {
    try {
      const jsonTasks = await AsyncStorage.getItem('tasks');
      if (jsonTasks) {
        const savedTasks = JSON.parse(jsonTasks);
        setTasks(savedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#B0A695'}}>
      <Text style={{ fontSize: 30, marginBottom: 50, marginTop: 50 }}>TO DO LIST</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, height: 50, borderColor: 'gray', borderWidth: 2, marginRight: 10, paddingLeft: 10 }}
          placeholder="Enter task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <Button title="Add" onPress={addTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text>{item.text}</Text>
            <Button title="Remove" onPress={() => removeTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
