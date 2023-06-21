/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import type {PropsWithChildren} from 'react';
import React, {useState} from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

interface Task {
  id: string;
  title: string;
}

function App(): JSX.Element {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    console.log(task);
    if (task !== '') {
      const newTask: Task = {
        id: String(Date.now()),
        title: task,
      };
      setTasks([...tasks, newTask]);
      setTask('');
    }
  };

  const handleRemoveTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <View>
      <Text>Checklist</Text>
      <View>
        <TextInput
          placeholder="Enter..."
          value={task}
          onChangeText={text => setTask(text)}></TextInput>
      </View>
      <Button title="Add" onPress={handleAddTask}></Button>
      <FlatList
        data={tasks}
        renderItem={({item}) => (
          <View>
            <Text>{item.title}</Text>
            <Button
              title="Remove"
              onPress={() => handleRemoveTask(item.id)}></Button>
          </View>
        )}></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
