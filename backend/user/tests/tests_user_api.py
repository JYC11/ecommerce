from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

REGISTER_USER_URL = reverse("user:register")
USER_LIST_URL = reverse("user:users")
USER_PROFILE_URL = reverse("user:users-profile")


def create_user(params):
    return get_user_model().objects.create(
        first_name=params["name"],
        username=params["email"],
        email=params["email"],
        password=make_password(params["password"]),
    )


def create_superuser(params):
    return get_user_model().objects.create(
        first_name=params["name"],
        username=params["email"],
        email=params["email"],
        password=make_password(params["password"]),
        is_staff=True,
    )


class PublicUserApiTests(TestCase):
    """test the publicaly available user api"""

    def setUp(self):
        self.client = APIClient()
        self.payload1 = {
            "name": "Jim Bob",
            "email": "jim@example.com",
            "password": "coolPassword123",
        }
        self.payload2 = {
            "name": "Mary",
            "email": "mary@example.com",
            "password": "coolPassword123",
        }

    def test_create_valid_user(self):
        """test valid user creation"""
        res = self.client.post(REGISTER_USER_URL, self.payload1)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["username"], self.payload1["email"])
        self.assertEqual(res.data["isAdmin"], False)
        self.assertIn("token", res.data)

    def test_create_user_with_duplicate_email(self):
        """test invalid user creation with duplicate email"""
        create_user(self.payload1)
        res = self.client.post(REGISTER_USER_URL, self.payload1)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(res.data["detail"], "User with this email exists")

    def test_get_users_unauthorized(self):
        """test get user list with no authorization"""
        create_user(self.payload1)
        create_user(self.payload2)
        res = self.client.get(USER_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )

    def test_get_user_profile_unauthorized(self):
        """test get user profile with no authorization"""
        create_user(self.payload2)
        res = self.client.get(USER_PROFILE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )


class PrivateUserApiTests(TestCase):
    """test the privately available user api"""

    def setUp(self):
        self.client = APIClient()
        self.payload_admin = {
            "name": "admin",
            "email": "admin@example.com",
            "password": "coolPassword123",
        }
        self.payload1 = {
            "name": "Jim Bob",
            "email": "jim@example.com",
            "password": "coolPassword123",
        }
        self.payload2 = {
            "name": "Mary",
            "email": "mary@example.com",
            "password": "coolPassword123",
        }
        self.admin = create_superuser(self.payload_admin)
        self.client.force_authenticate(user=self.admin)

    def test_get_user_profile_authorized(self):
        """test get admin profile with no authorization"""
        res = self.client.get(USER_PROFILE_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("password", res.data)
        self.assertEqual(
            res.data,
            {
                "_id": 1,
                "username": "admin@example.com",
                "email": "admin@example.com",
                "name": "admin",
                "isAdmin": True,
            },
        )

    def test_get_users_authorized(self):
        """test get user list with authorization"""
        create_user(self.payload1)
        create_user(self.payload2)
        res = self.client.get(USER_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 3)
