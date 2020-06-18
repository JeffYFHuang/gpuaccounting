# coding: utf-8

"""
    Kubernetes

    No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)  # noqa: E501

    OpenAPI spec version: v1.15.6
    Generated by: https://openapi-generator.tech
"""


import pprint
import re  # noqa: F401

import six


class PolicyV1beta1HostPortRange(object):
    """NOTE: This class is auto generated by OpenAPI Generator.
    Ref: https://openapi-generator.tech

    Do not edit the class manually.
    """

    """
    Attributes:
      openapi_types (dict): The key is attribute name
                            and the value is attribute type.
      attribute_map (dict): The key is attribute name
                            and the value is json key in definition.
    """
    openapi_types = {
        'max': 'int',
        'min': 'int'
    }

    attribute_map = {
        'max': 'max',
        'min': 'min'
    }

    def __init__(self, max=None, min=None):  # noqa: E501
        """PolicyV1beta1HostPortRange - a model defined in OpenAPI"""  # noqa: E501

        self._max = None
        self._min = None
        self.discriminator = None

        self.max = max
        self.min = min

    @property
    def max(self):
        """Gets the max of this PolicyV1beta1HostPortRange.  # noqa: E501

        max is the end of the range, inclusive.  # noqa: E501

        :return: The max of this PolicyV1beta1HostPortRange.  # noqa: E501
        :rtype: int
        """
        return self._max

    @max.setter
    def max(self, max):
        """Sets the max of this PolicyV1beta1HostPortRange.

        max is the end of the range, inclusive.  # noqa: E501

        :param max: The max of this PolicyV1beta1HostPortRange.  # noqa: E501
        :type: int
        """
        if max is None:
            raise ValueError("Invalid value for `max`, must not be `None`")  # noqa: E501

        self._max = max

    @property
    def min(self):
        """Gets the min of this PolicyV1beta1HostPortRange.  # noqa: E501

        min is the start of the range, inclusive.  # noqa: E501

        :return: The min of this PolicyV1beta1HostPortRange.  # noqa: E501
        :rtype: int
        """
        return self._min

    @min.setter
    def min(self, min):
        """Sets the min of this PolicyV1beta1HostPortRange.

        min is the start of the range, inclusive.  # noqa: E501

        :param min: The min of this PolicyV1beta1HostPortRange.  # noqa: E501
        :type: int
        """
        if min is None:
            raise ValueError("Invalid value for `min`, must not be `None`")  # noqa: E501

        self._min = min

    def to_dict(self):
        """Returns the model properties as a dict"""
        result = {}

        for attr, _ in six.iteritems(self.openapi_types):
            value = getattr(self, attr)
            if isinstance(value, list):
                result[attr] = list(map(
                    lambda x: x.to_dict() if hasattr(x, "to_dict") else x,
                    value
                ))
            elif hasattr(value, "to_dict"):
                result[attr] = value.to_dict()
            elif isinstance(value, dict):
                result[attr] = dict(map(
                    lambda item: (item[0], item[1].to_dict())
                    if hasattr(item[1], "to_dict") else item,
                    value.items()
                ))
            else:
                result[attr] = value

        return result

    def to_str(self):
        """Returns the string representation of the model"""
        return pprint.pformat(self.to_dict())

    def __repr__(self):
        """For `print` and `pprint`"""
        return self.to_str()

    def __eq__(self, other):
        """Returns true if both objects are equal"""
        if not isinstance(other, PolicyV1beta1HostPortRange):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """Returns true if both objects are not equal"""
        return not self == other