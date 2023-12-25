from django.contrib import admin
from todoListApp.models import Task, CustomUser
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin.models import LogEntry

class Tasks(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'created_at', 'status')
    list_display_links = ('id', 'title')
    search_fields = ('title',)
    list_per_page = 15

admin.site.register(Task, Tasks)


class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(LogEntry)