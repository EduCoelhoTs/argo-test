from rest_framework import serializers
from todoListApp.models import Task, TaskList
from django.contrib.auth import get_user_model

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
    
class TaskListSerializer(serializers.ModelSerializer):

    tasks = serializers.SerializerMethodField()

    class Meta:
        model = TaskList
        fields = ['title', 'tasks', 'id']

    def get_tasks(self, task_list):
        tasks = Task.objects.filter(taskList=task_list)
        serializer = TaskSerializer(tasks, many=True)
        return serializer.data

class TasksByTaskListIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'is_default_user', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            is_default_user=validated_data.get('is_default_user', False)
        )
        return user