from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from core.models import User

REGISTER_USER_URL = reverse("user:register")
USER_LIST_URL = reverse("user:users")
USER_PROFILE_URL = reverse("user:users-profile")
USER_PROFILE_UPDATE_URL = reverse("user:users-profile-update")
ADMIN_GET_USER_BY_ID_URL = reverse("user:admin-get-by-id", args=[1])
ADMIN_UPDATE_URL = reverse("user:admin-update", args=[1])
ADMIN_DELETE_URL = reverse("user:admin-delete", args=[2])


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

    def test_get_user_by_id_no_auth_no_admin(self):
        """test get user profile with no authorization, not admin"""
        create_user(self.payload1)
        res = self.client.get(ADMIN_GET_USER_BY_ID_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )

    def test_update_user_no_auth_no_admin(self):
        """test update user profile with no authorization, not admin"""
        create_user(self.payload1)
        res = self.client.put(ADMIN_UPDATE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )

    def test_delete_user_no_auth_no_admin(self):
        """test delete user profile with no authorization, not admin"""
        create_user(self.payload1)
        res = self.client.delete(ADMIN_DELETE_URL)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(
            res.data["detail"], "Authentication credentials were not provided."
        )


class PrivateAdminUserApiTests(TestCase):
    """test the privately available user api for admin users"""

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
        self.update_payload = {
            "name": "john joestar",
            "email": "john@email.com",
            "password": "",
            "isAdmin": True,
        }
        self.admin = create_superuser(self.payload_admin)
        self.client.force_authenticate(user=self.admin)

    def test_get_admin_profile_authorized(self):
        """test get admin profile with authorization"""
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

    def test_get_user_by_id(self):
        """test get user profile"""
        res = self.client.get(ADMIN_GET_USER_BY_ID_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
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

    def test_update_user(self):
        """test update user profile"""
        res = self.client.put(ADMIN_UPDATE_URL, self.update_payload)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            res.data,
            {
                "_id": 1,
                "username": "john@email.com",
                "email": "john@email.com",
                "name": "john joestar",
                "isAdmin": "True",
            },
        )

    def test_delete_user(self):
        """test delete user profile"""
        create_user(self.payload2)
        users_before = (self.client.get(USER_LIST_URL)).data

        res = self.client.delete(ADMIN_DELETE_URL)
        users_after = (self.client.get(USER_LIST_URL)).data

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, {"deleted_user_id": "2"})
        self.assertLess(len(users_after), len(users_before))
        self.assertEqual(len(users_after), 1)

        deleted_user = User.objects.filter(id=2)
        self.assertEquals(deleted_user.exists(), False)


class PrivateUserApiTests(TestCase):
    """test the privately available user api for normal users"""

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
        self.update_payload = {
            "name": "john joestar",
            "email": "john@email.com",
            "password": "",
            "isAdmin": True,
        }
        self.user = create_user(self.payload1)
        self.client.force_authenticate(user=self.user)

    def test_get_user_profile_authorized(self):
        """test get user profile with authorization"""
        res = self.client.get(USER_PROFILE_URL)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("password", res.data)
        self.assertEqual(
            res.data,
            {
                "_id": 1,
                "username": "jim@example.com",
                "email": "jim@example.com",
                "name": "Jim Bob",
                "isAdmin": False,
            },
        )

    def test_get_users_not_staff(self):
        """test get user list when not staff"""
        create_user(self.payload2)
        res = self.client.get(USER_LIST_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            res.data["detail"], "You do not have permission to perform this action."
        )

    def test_update_user_profile(self):
        """test update user profile when not staff"""
        self.client.put(USER_PROFILE_UPDATE_URL, self.update_payload)
        updated_profile = self.client.get(USER_PROFILE_URL)
        self.assertEqual(updated_profile.data["name"], self.update_payload["name"])
        self.assertEqual(updated_profile.data["email"], self.update_payload["email"])
        self.assertEqual(updated_profile.data["username"], self.update_payload["email"])

    def test_get_user_by_id_no_admin(self):
        """test get user profile not admin"""
        res = self.client.get(ADMIN_GET_USER_BY_ID_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            res.data["detail"], "You do not have permission to perform this action."
        )

    def test_update_user_no_admin(self):
        """test update user profile not admin"""
        res = self.client.put(ADMIN_UPDATE_URL, self.update_payload)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            res.data["detail"], "You do not have permission to perform this action."
        )

    def test_delete_user_no_admin(self):
        """test delete user profile not admin"""
        res = self.client.delete(ADMIN_DELETE_URL)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            res.data["detail"], "You do not have permission to perform this action."
        )
