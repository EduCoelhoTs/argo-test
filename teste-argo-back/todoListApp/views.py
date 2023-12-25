from rest_framework import viewsets, generics, status
from todoListApp.models import Task, TaskList
from todoListApp.serializer import TaskSerializer, TaskListSerializer, TasksByTaskListIdSerializer,CustomUserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import  permission_classes

import pandas as pd

@permission_classes([AllowAny, ])
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@permission_classes([AllowAny, ])
class TaskListViewSet(viewsets.ModelViewSet):
    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer

    def get(self, request, *args, **kwargs):
        task_lists = TaskList.objects.all()
        serializer = TaskListSerializer(task_lists, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        title = request.data.get('title')
        file = request.data.get('file')

        new_task_list = TaskList.objects.create(title = title)

        if file == 'null':
            file = None  

        if file:
            try:
                task_list = TaskList.objects.get(id=new_task_list.id)

                df = pd.read_excel(file)

                for index, row in df.iterrows():
                    task_data = {
                        'title': row.get('title'),
                        'description': row.get('description'),
                        'status': row.get('status', 'Aberto'),
                        'taskList': task_list.id,
                    }

                    serializer = TaskSerializer(data=task_data)

                    if serializer.is_valid():
                        serializer.save()  
                    else:
                        task_list.delete()
                        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

                return Response({'message': 'Tarefas cadastradas com sucesso'}, status=status.HTTP_201_CREATED)

            except Exception as e:
                task_list.delete()
                return Response({'error': f'Erro durante a leitura do Excel: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response({'message': 'Task criada com sucesso'}, status=status.HTTP_201_CREATED)
         
@permission_classes([AllowAny, ])
class TasksByTaskListIdView(generics.ListAPIView):
    def get_queryset(self):
        queryset = Task.objects.filter(taskList=self.kwargs['taskListID'])
        task_list = TaskList.objects.get(id=self.kwargs['taskListID'])
        return {
            'taskList': task_list.title,
            'tasks': queryset
        }
    serializer_class = TasksByTaskListIdSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

class CustomUserRegistrationView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({'message': 'Usuário registrado com sucesso'}, status=status.HTTP_201_CREATED)