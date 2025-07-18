from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=200)
    message = serializers.CharField()

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # <-- this is key
    class Meta:
        model = Profile
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate(self, data):
        errors = {}
        if User.objects.filter(username=data['username']).exists():
            errors['username'] = ["Username already exists"]
        if User.objects.filter(email=data['email']).exists():
            errors['email'] = ["Email already exists"]
        if errors:
            raise serializers.ValidationError(errors)
        return data


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user
