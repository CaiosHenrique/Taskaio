import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { FloatingHeader } from '@/components/FloatingHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { taskService } from '@/services/taskService';
import { Task } from '@/types/task';
import { getNextPriority, sanitizeTaskTitle, validateTaskTitle } from '@/utils/taskUtils';

export default function HomeScreen() {
  const [goals, setGoals] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Carregar tasks da API quando o componente montar
  useEffect(() => {
    const loadInitialTasks = async () => {
      try {
        setLoading(true);
        const tasks = await taskService.getTasks();
        setGoals(tasks);
      } catch (error) {
        console.error('❌ Erro ao carregar tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await taskService.getTasks();
      setGoals(tasks);
    } catch (error) {
      console.error('❌ Erro ao carregar tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTask = async () => {
    if (!validateTaskTitle(newTaskTitle)) {
      Alert.alert('Erro', 'Por favor, digite um título válido para a task.');
      return;
    }
    try {
      const sanitizedTitle = sanitizeTaskTitle(newTaskTitle);
      let newPriority = getNextPriority(goals);
      if (newPriority > 3) newPriority = 3; // Limite imposto pelo backend
      const newTask = await taskService.createTask({
        title: sanitizedTitle,
        priority: newPriority,
        done: false,
      });
      setGoals(prevGoals => [...prevGoals, newTask]);
      setNewTaskTitle('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao criar task:', error);
      Alert.alert('Erro', 'Não foi possível criar a task.');
    }
  };

  const toggleGoal = async (id: string) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;
      const updatedGoal = await taskService.updateTask(id, { done: !goal.done });
      setGoals(goals => goals.map(goal => goal.id === id ? updatedGoal : goal));
    } catch (error) {
      console.error('Erro ao atualizar task:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a task.');
    }
  };

  const handleDragEnd = async (data: Task[]) => {
    const updatedData = data.map((task, index) => ({ ...task, priority: index + 1 }));
    setGoals(updatedData);
    try {
      const updatePromises = updatedData.map((task) => taskService.updateTask(task.id, { priority: task.priority }));
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Erro ao atualizar prioridades:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a ordem das tasks.');
      loadTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setGoals(goals => goals.filter(task => task.id !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível apagar a task.');
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    const taskContent = (
      <TouchableOpacity
        style={[
          styles.goalItem,
          item.done && styles.goalDone,
          isActive && styles.dragging
        ]}
        onPress={() => toggleGoal(item.id)}
        onLongPress={drag}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={item.done ? '#4CAF50' : '#A1CEDC'}
          style={{ marginRight: 12 }}
        />
        <ThemedText style={[styles.goalText, item.done && styles.goalTextDone]}>
          {item.title}
        </ThemedText>
        <View style={[styles.priority, { backgroundColor: '#A1CEDC' }]}> 
          <ThemedText style={styles.priorityText}>#{item.task_id}</ThemedText>
        </View>
        <Ionicons
          name="menu"
          size={20}
          color="#A1CEDC"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>
    );
    if (item.done) {
      return (
        <Swipeable
          renderRightActions={() => (
            <TouchableOpacity
              style={{
                backgroundColor: '#FF6B6B',
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                height: '100%',
                borderRadius: 12,
              }}
              onPress={() => handleDeleteTask(item.id)}
            >
              <Ionicons name="trash" size={28} color="#fff" />
              <ThemedText style={{ color: '#fff', fontWeight: 'bold', marginTop: 4 }}>Apagar</ThemedText>
            </TouchableOpacity>
          )}
        >
          {taskContent}
        </Swipeable>
      );
    }
    return taskContent;
  };

  return (
    <ThemedView style={styles.container}>
      <FloatingHeader
        title="Taskaio"
        subtitle="Organize suas metas e tarefas por prioridade"
      />
      <View style={{ height: 120 }} />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <ThemedText style={styles.addButtonText}>Nova Task</ThemedText>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText>Carregando tasks...</ThemedText>
        </View>
      ) : (
        <DraggableFlatList
          data={goals.sort((a, b) => a.priority - b.priority)}
          onDragEnd={({ data }) => handleDragEnd(data)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 16, color: '#666' }}>
                Nenhuma task encontrada
              </ThemedText>
            </View>
          )}
        />
      )}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Nova Task</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="Digite o título da task..."
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              multiline
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewTaskTitle('');
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createNewTask}
              >
                <ThemedText style={styles.createButtonText}>Criar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A1CEDC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  goalDone: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  dragging: {
    opacity: 0.8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  goalText: {
    fontSize: 18,
    flex: 1,
    color: '#1D3D47',
  },
  goalTextDone: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontStyle: 'italic',
  },
  priority: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  priorityText: {
    color: '#1D3D47',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3D47',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  createButton: {
    backgroundColor: '#A1CEDC',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
