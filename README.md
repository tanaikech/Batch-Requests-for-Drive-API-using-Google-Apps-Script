# Batch Requests for Drive API using Google Apps Script

<a name="top"></a>

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="overview"></a>

## Overview

**These are the sample scripts of the batch requests for Drive API using Google Apps Script.**

<a name="description"></a>

## Description

When we want to manage the files and folders on Google Drive, we have 2 ways. One is the use of [Drive service](https://developers.google.com/apps-script/reference/drive). Another is the use of [Drive API](https://developers.google.com/drive). In the case of them, when we want to manage a lot of files and folders, unfortunately, both ways have no batch requests. Namely, for example, the metadata of a lot of files are changed, [the methods in Class File](https://developers.google.com/apps-script/reference/drive/file) and [Files: update](https://developers.google.com/drive/api/v3/reference/files/update) are required to be used in the loop. In this case, the process cost will be high. On the other hand, Drive API can use [the batch requests](https://developers.google.com/drive/api/v3/batch). But in this case, in order to use this batch requests with Google Apps Script, it is required to create the request body of `multipart/mixed` by each user. Because there are no methods for automatically requests the batch requests. From this situation, here, I would like to introduce the simple sample scripts for creating, updating and deleting the files and folders on Google Drive using the batch requests with Google Apps Script.

<a name="usage"></a>

## Usage

The sample scripts use [BatchRequest](https://github.com/tanaikech/BatchRequest) of the Google Apps Script library.

### 1. Install BatchRequest

You can see how to install BatchRequest at [here](https://github.com/tanaikech/BatchRequest#how-to-install).

### 2. Sample script

#### Deleting files

In this sample script, the files are deleted. So when you use this, please be careful. I recommend to use a sample file.

```javascript
function deleteFiles() {
  const fileIds = [
    "### fileId 1###",
    "### fileId 2###",
    "### fileId 2###",
    ,
    ,
    ,
  ];

  const requests = fileIds.map((id) => ({
    method: "DELETE",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}`,
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests,
  });
  console.log(res);
}
```

#### Changing file metadata

In this sample script, the files are moved to the specific folder by changing the filename. So when you use this, please be careful. I recommend to use a sample file.

```javascript
function moveFilesAndChangeFileNames() {
  const fileIds = [
    { id: "### fileId 1###", newName: "sample1" },
    { id: "### fileId 2###", newName: "sample2" },
    { id: "### fileId 3###", newName: "sample3" },
    ,
    ,
    ,
  ];
  const sourceFolderId = "###"; // Ser source folder ID.
  const destinationFolderId = "###"; // Set destination folder ID.

  const requests = fileIds.map(({ id, newName }) => ({
    method: "PATCH",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}?removeParents=${sourceFolderId}&addParents=${destinationFolderId}`,
    requestBody: { name: newName },
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests,
  });
  console.log(res);
}
```

#### Copying files by converting mimeType

In this sample script, the Excel files are copied to the specific folder as the Google Spreadsheet.

```javascript
function copyAndConvertFiles() {
  const fileIds = [
    "### fileId 1###",
    "### fileId 2###",
    "### fileId 2###",
    ,
    ,
    ,
  ];
  const destinationFolderId = "###"; // Set destination folder ID.

  const requests = fileIds.map((id) => ({
    method: "POST",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/copy`,
    requestBody: {
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [destinationFolderId],
    },
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests,
  });
  console.log(res);
}
```

#### Creating permission to multiple files

In this sample script, the permission is created for an user to the multiple files.

```javascript
function createPermissions1() {
  const fileIds = [
    {
      id: "### fileId 1###",
      role: "reader",
      type: "user",
      email: "###",
    },
    {
      id: "### fileId 2###",
      role: "reader",
      type: "user",
      email: "###",
    },
    {
      id: "### fileId 3###",
      role: "writer",
      type: "user",
      email: "###",
    },
    ,
    ,
    ,
  ];

  const requests = fileIds.map(({ id, role, type, email }) => ({
    method: "POST",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/permissions`,
    requestBody: {
      role: role,
      type: type,
      emailAddress: email,
    },
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests,
  });
  console.log(res);
}
```

#### Creating permissions to a file

In this sample script, the permissions are created for multiple users to a file.

```javascript
function createPermissions2() {
  const sourceFileId = "###"; // Set source file ID.
  const fileIds = [
    { role: "reader", type: "user", email: "### email 1 ###" },
    { role: "writer", type: "user", email: "### email 2 ###" },
    { role: "writer", type: "user", email: "### email 3 ###" },
    ,
    ,
    ,
  ];

  const requests = fileIds.map(({ role, type, email }) => ({
    method: "POST",
    endpoint: `https://www.googleapis.com/drive/v3/files/${sourceFileId}/permissions`,
    requestBody: {
      role: role,
      type: type,
      emailAddress: email,
    },
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests,
  });
  console.log(res);
}
```

#### Retrieving permission list from multiple files

In this sample script, the permission list is retrieved from multiple files.

```javascript
function getPermissionList() {
  const fileIds = [
    "### fileId 1###",
    "### fileId 2###",
    "### fileId 2###",
    ,
    ,
    ,
  ];

  const requests = fileIds.map((id) => ({
    method: "GET",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/permissions`,
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests,
  });
  console.log(JSON.stringify(res));
}
```

#### Deleting all permissions from multiple files

In this sample script, all permissions are deleted from multiple files. So when you use this, please be careful. I recommend to use a sample file.

```javascript
function deleteAllPermissionsFromFiles() {
  // Retrieve the permission list.
  const fileIds = [
    "### fileId 1###",
    "### fileId 2###",
    "### fileId 2###",
    ,
    ,
    ,
  ];

  const requests1 = fileIds.map((id) => ({
    method: "GET",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/permissions?fields=*`,
  }));
  const data = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests1,
  });
  const ownerEmail = Session.getActiveUser().getEmail();
  const list = data.reduce((ar, { permissions }, i) => {
    permissions.forEach(({ id, emailAddress }) => {
      if (emailAddress != ownerEmail)
        ar.push({ id: fileIds[i], permissionId: id });
    });
    return ar;
  }, []);

  // Delete all permissions from all files.
  const requests2 = list.map(({ id, permissionId }) => ({
    method: "DELETE",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/permissions/${permissionId}`,
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests2,
  });
  console.log(res);
}
```

#### Updating permissions of multiple files

In this sample script, the permissions of multiple files are updated. The permissions of user of `"### email address ###"` are modified. So when you use this, please be careful. I recommend to use a sample file.

```javascript
function changePermissionsOfFiles() {
  // In this case, the role of the usef of email is changed from 'reader' to 'writer' for all files of fileIds.
  const change = { role: "writer", email: "### email address ###" };

  // Retrieve the permission list.
  const fileIds = [
    "### fileId 1###",
    "### fileId 2###",
    "### fileId 2###",
    ,
    ,
    ,
  ];

  const requests1 = fileIds.map((id) => ({
    method: "GET",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/permissions?fields=*`,
  }));
  const data = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests1,
  });
  const list = data.reduce((ar, { permissions }, i) => {
    permissions.forEach(({ id, emailAddress }) => {
      if (emailAddress == change.email)
        ar.push({ id: fileIds[i], permissionId: id });
    });
    return ar;
  }, []);

  // Delete all permissions from all files.
  const requests2 = list.map(({ id, permissionId }) => ({
    method: "PATCH",
    endpoint: `https://www.googleapis.com/drive/v3/files/${id}/permissions/${permissionId}`,
    requestBody: { role: change.role },
  }));
  const res = BatchRequest.EDo({
    batchPath: "batch/drive/v3",
    requests: requests2,
  });
  console.log(res);
}
```

## IMPORTANT

- At the batch requests, 100 API requests can be run with the asynchronous process as one API call.

  - When the library of [BatchRequest](https://github.com/tanaikech/BatchRequest) is used, all requests can be processed in the library, even when the number of your requests is more than 100.

- When you manage a lot of files using Drive API, please be careful of Quotas for Google Services. [Ref](https://developers.google.com/apps-script/guides/services/quotas)

## References:

- [Files: delete](https://developers.google.com/drive/api/v3/reference/files/delete)
- [Files: update](https://developers.google.com/drive/api/v3/reference/files/update)
- [Files: copy](https://developers.google.com/drive/api/v3/reference/files/copy)
- [Permissions: create](https://developers.google.com/drive/api/v3/reference/permissions/create)
- [Permissions: list](https://developers.google.com/drive/api/v3/reference/permissions/list)
- [Permissions: delete](https://developers.google.com/drive/api/v3/reference/permissions/delete)
- [Permissions: update](https://developers.google.com/drive/api/v3/reference/permissions/update)

---

<a name="licence"></a>

# Licence

[MIT](LICENCE)

<a name="author"></a>

# Author

[Tanaike](https://tanaikech.github.io/about/)

If you have any questions or comments, feel free to contact me.

<a name="updatehistory"></a>

# Update History

- v1.0.0 (June 15, 2020)

  1. Initial release.

[TOP](#top)
