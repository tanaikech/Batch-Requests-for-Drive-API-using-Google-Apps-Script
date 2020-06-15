// Deleting files
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

// Changing file metadata
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

// Copying files by converting mimeType
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

// Creating permission to multiple files
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

// Creating permissions to a file
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

// Retrieving permission list from multiple files
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

// Deleting all permissions from multiple files
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

// Updating permissions of multiple files
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


