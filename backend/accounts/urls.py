from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, ProfileView, ProfileUpdateView, send_contact_email
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'),

    path('send/', send_contact_email, name='send_contact_email'),
]



