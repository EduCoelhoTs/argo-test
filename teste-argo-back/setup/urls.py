from django.contrib import admin
from django.urls import path, include
from rest_framework import routers, permissions
from todoListApp.views import TaskViewSet, TaskListViewSet, TasksByTaskListIdView, CustomTokenObtainPairView, CustomUserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Todo List API",
        default_version='v1',
        description="Lista de Tarefas",
        contact=openapi.Contact(email="eduardocoelhosilva12@gmail.com"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


defaultRouter = routers.DefaultRouter()
defaultRouter.register('tasks', TaskViewSet, basename='Tarefas')
defaultRouter.register('tasksList', TaskListViewSet, basename='Lista_Tarefas')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(defaultRouter.urls)),
    path('tasksList/<int:taskListID>/task/', TasksByTaskListIdView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', CustomUserRegistrationView.as_view(), name='custom_user_registration'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
