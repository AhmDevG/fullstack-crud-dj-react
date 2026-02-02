from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Product
from .serializers import ProductSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"id": user.id, "username": user.username, "email": user.email})


class ProductCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer


class ProductEditView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        user = self.request.user
        return Product.objects.filter(author=user)


class ProductListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    queryset = Product.objects.select_related("author").all()


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response({"message": "User deleted"})


@api_view(["POST"])
def create_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response(
            {"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST
        )
    if User.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response(
        {
            "message": "User created successfully",
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_username(request):
    user = request.user
    username = request.data.get("username")
    if not username:
        return Response({"error": "Username required"}, status=400)
    user.username = username
    user.save()
    return Response({"message": "Username updated", "username": user.username})


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    password = request.data.get("password")
    if not password:
        return Response({"error": "Password required"}, status=400)
    user.set_password(password)
    user.save()
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "message": "Password updated",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
    )
