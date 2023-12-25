from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.admin.models import LogEntry

## title, description, status

class TaskList(models.Model):
    title = models.CharField(max_length=255, null=False)

    def __str__(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=255, null=False)
    description = models.TextField()
    status = models.CharField(max_length=255, choices=[('Aberto', 'Aberto'), ('Concluído', 'Concluído')], default='Aberto')
    created_at = models.DateTimeField(auto_now_add=True)
    taskList = models.ForeignKey(TaskList, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class CustomUser(AbstractUser):
    
    is_default_user = models.BooleanField(default=False)

    def __str__(self):
        return self.username