from rest_framework import generics, permissions
from .serializers import RegisterSerializer, ProfileSerializer
from django.contrib.auth.models import User
from .models import Profile
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.decorators import login_required

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        print("Authenticated user:", self.request.user)
        print("User has profile:", hasattr(self.request.user, 'profile'))
        return self.request.user.profile

from rest_framework import generics, permissions
from .models import Profile
from .serializers import ProfileSerializer

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.core.mail import send_mail
from .serializers import ContactSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact_email(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        subject = serializer.validated_data['subject']
        message = serializer.validated_data['message']

        try:
            full_message = f"From: {name}\nEmail: {email}\n\nMessage:\n{message}"

            send_mail(
                subject=subject,
                message=full_message,
                from_email=email,          
                recipient_list=['anticheatingsystem@gmail.com'],
                fail_silently=False,
            )

            return Response({'success': True, 'message': 'Message sent successfully'})
        except Exception as e:
            print(e)
            return Response({'success': False, 'message': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
