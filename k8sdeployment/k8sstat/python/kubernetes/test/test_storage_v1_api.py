# coding: utf-8

"""
    Kubernetes

    No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)  # noqa: E501

    OpenAPI spec version: v1.15.6
    Generated by: https://openapi-generator.tech
"""


from __future__ import absolute_import

import unittest

import kubernetes.client
from kubernetes.client.api.storage_v1_api import StorageV1Api  # noqa: E501
from kubernetes.client.rest import ApiException


class TestStorageV1Api(unittest.TestCase):
    """StorageV1Api unit test stubs"""

    def setUp(self):
        self.api = kubernetes.client.api.storage_v1_api.StorageV1Api()  # noqa: E501

    def tearDown(self):
        pass

    def test_create_storage_class(self):
        """Test case for create_storage_class

        """
        pass

    def test_create_volume_attachment(self):
        """Test case for create_volume_attachment

        """
        pass

    def test_delete_collection_storage_class(self):
        """Test case for delete_collection_storage_class

        """
        pass

    def test_delete_collection_volume_attachment(self):
        """Test case for delete_collection_volume_attachment

        """
        pass

    def test_delete_storage_class(self):
        """Test case for delete_storage_class

        """
        pass

    def test_delete_volume_attachment(self):
        """Test case for delete_volume_attachment

        """
        pass

    def test_get_api_resources(self):
        """Test case for get_api_resources

        """
        pass

    def test_list_storage_class(self):
        """Test case for list_storage_class

        """
        pass

    def test_list_volume_attachment(self):
        """Test case for list_volume_attachment

        """
        pass

    def test_patch_storage_class(self):
        """Test case for patch_storage_class

        """
        pass

    def test_patch_volume_attachment(self):
        """Test case for patch_volume_attachment

        """
        pass

    def test_patch_volume_attachment_status(self):
        """Test case for patch_volume_attachment_status

        """
        pass

    def test_read_storage_class(self):
        """Test case for read_storage_class

        """
        pass

    def test_read_volume_attachment(self):
        """Test case for read_volume_attachment

        """
        pass

    def test_read_volume_attachment_status(self):
        """Test case for read_volume_attachment_status

        """
        pass

    def test_replace_storage_class(self):
        """Test case for replace_storage_class

        """
        pass

    def test_replace_volume_attachment(self):
        """Test case for replace_volume_attachment

        """
        pass

    def test_replace_volume_attachment_status(self):
        """Test case for replace_volume_attachment_status

        """
        pass


if __name__ == '__main__':
    unittest.main()
