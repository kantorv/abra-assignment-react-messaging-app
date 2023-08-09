import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import type { GridRowParams,MuiEvent, GridCallbackDetails  } from '@mui/x-data-grid'; 
import { useNavigate } from 'react-router-dom';


const columns: GridColDef[] = [
  {
    field: 'from',
    headerName: 'From',
    width: 150,
    editable: false,
    sortable: false
  },
  {
    field: 'subject',
    headerName: 'Subject',
    minWidth: 150,
    flex: 1,
    editable: false,
    sortable: false,
    
    // valueGetter: (params: GridValueGetterParams) =>
    // `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },

  {
    field: 'created',
    headerName: 'Created',
    description: 'This column has a value getter and is not sortable.',
    sortable: true,
    width: 160,

  },
];


const sampleMessages:UserMessage[] = 
[
    {
        "id": "5462da8b-0000-434d-8fe4-392d0294e19d",
        "subject": "Test Subj",
        "message": "Hello World",
        "created": "2023-08-07T06:54:59.154834Z",
        "from": "testuser",
        "to": "admin"
    },
    {
        "id": "4847a164-f96d-4444-96af-8bbfdda82e01",
        "subject": "Test Subj234234234234",
        "message": "Hello Worl234234d",
        "created": "2023-08-07T06:50:15.157624Z",
        "from": "testuser",
        "to": "admin"
    },
    {
        "id": "9d4b558f-e838-4e7c-aa13-b6d9f58e138f",
        "subject": "New message",
        "message": "zsedfsregsretgf",
        "created": "2023-08-06T17:55:20.773327Z",
        "from": "demo1",
        "to": "admin"
    },
    {
      "id": "5462da8b-2222-434d-8fe4-392d0294e19d",
      "subject": "Test Subj",
      "message": "Hello World",
      "created": "2023-08-07T06:54:59.154834Z",
      "from": "testuser",
      "to": "admin"
  },
  {
      "id": "4847a164-2222-4444-96af-8bbfdda82e01",
      "subject": "Test Subj234234234234",
      "message": "Hello Worl234234d",
      "created": "2023-08-07T06:50:15.157624Z",
      "from": "testuser",
      "to": "admin"
  },
  {
      "id": "9d4b558f-2222-4e7c-aa13-b6d9f58e138f",
      "subject": "New message",
      "message": "zsedfsregsretgf",
      "created": "2023-08-06T17:55:20.773327Z",
      "from": "demo1",
      "to": "admin"
  },
  {
    "id": "5462da8b-3333-434d-8fe4-392d0294e19d",
    "subject": "Test Subj",
    "message": "Hello World",
    "created": "2023-08-07T06:54:59.154834Z",
    "from": "testuser",
    "to": "admin"
},
{
    "id": "4847a164-3333-4444-96af-8bbfdda82e01",
    "subject": "Test Subj234234234234",
    "message": "Hello Worl234234d",
    "created": "2023-08-07T06:50:15.157624Z",
    "from": "testuser",
    "to": "admin"
},
{
    "id": "9d4b558f-3333-4e7c-aa13-b6d9f58e138f",
    "subject": "New message",
    "message": "zsedfsregsretgf",
    "created": "2023-08-06T17:55:20.773327Z",
    "from": "demo1",
    "to": "admin"
}
]

export default function DataGridDemo() {

  const navigate = useNavigate()
  const onRowClick = (params: GridRowParams, event: MuiEvent, details: GridCallbackDetails)=>{
    const {id} = params
    console.log("row clicked", id)
    navigate(`/messages/${id}`)
  }


  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={sampleMessages}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[5,25, 50]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnMenu
        disableColumnSelector


        onCellClick={()=>false}
        onRowClick ={onRowClick}
      />
    </Box>
  );
}
