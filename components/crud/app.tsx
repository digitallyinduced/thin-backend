import React, { useState, useEffect, useCallback } from 'react';
import * as ReactDOM from 'react-dom'

import { query, initIHPBackend, DataSubscription, createRecord, updateRecord, deleteRecord, createRecords, ensureIsUser, logout, getCurrentUserId, TableName } from 'ihp-backend';
import { useQuery, useCurrentUser, IHPBackend } from 'ihp-backend/react';
import { Button, Modal } from 'react-bootstrap';


function App() {
    // With `useQuery()` you can access your database:
    // 
    //     const todos = useQuery(query('todos').orderBy('createdAt'));

    return <IHPBackend requireLogin>
        <div className="container">
            <AppNavbar/>

            <Crud query={query('tasks')} />
        </div>
    </IHPBackend>
}

interface CrudProps<table> {
    table: table;
}

function Crud<table extends TableName>({ query }: CrudProps<table>) {
    const records = useQuery(query);
    const [showNewRecordModal, setShowNewRecordModal] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    if (records === null) {
        return <div>Loading ..</div>
    }

    const fieldNames = records.length > 0 ? Object.keys(records[0]).filter(key => key !== 'id') : [];

    return <div className="thin-crud-table-container">
        <div className="thin-crud-table-scroll-container">
            <table className="thin-crud-table">
                <thead>
                    <tr>
                        {fieldNames.map(fieldName => <th scope="col" key={fieldName}>{camelCaseToTitle(fieldName)}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => <CrudRow record={record} key={record.id} editRecord={setEditRecord}/>)}
                </tbody>
            </table>
        </div>

        <div className="bg-light text-right p-2">
            <button className="btn btn-primary" onClick={() => setShowNewRecordModal(true)}>+ Add Record</button>
        </div>
        <NewRecordModal table={query.query.table} show={showNewRecordModal} setShow={setShowNewRecordModal} fieldNames={fieldNames}/>
        <EditRecordModal table={query.query.table} show={editRecord !== null} onHide={() => setEditRecord(null)} record={editRecord}/>
    </div>
}

function camelCaseToTitle(camelCaseString) {
    const result = camelCaseString.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

function NewRecordModal({ table, show, setShow, fieldNames }) {
    const handleClose = () => setShow(false);
    const [newRecord, setNewRecord] = useState({});
    const handleCreateRecordClick = () => {
        createRecord(table, Object.assign({}, newRecord));
        setShow(false);
        setNewRecord({});
    }

    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>New Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {fieldNames.map(fieldName => <RecordField
                    fieldName={fieldName}
                    value={newRecord[fieldName] || ''}
                    setValue={value => setNewRecord(newRecord => Object.assign({}, newRecord, {[fieldName]: value}))}
                    key={fieldName}
                />
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateRecordClick}>
                Create Record
            </Button>
        </Modal.Footer>
    </Modal>
}

function EditRecordModal({ table, show, onHide, record }) {
    const handleClose = () => setShow(false);
    const [newRecord, setNewRecord] = useState({});
    const handleCreateRecordClick = () => {
        updateRecord(table, record.id, patch);
        onHide();
        setPatch({});
    }
    const [patch, setPatch] = useState({});
    const onDelete = () => {
        if (window.confirm('Are you sure you want to delete this?')) {
            deleteRecord(table, record.id);
            onHide();
        }
    }

    const formControls = [];
    for (const field in record) {
        if (field === 'id') continue;
        if (field === 'createdAt') continue;
        if (field === 'updatedAt') continue;

        formControls.push(<RecordField
            fieldName={field}
            value={field in patch ? patch[field] : record[field]}
            setValue={value => setPatch(patch => Object.assign({}, patch, {[field]: value}))}
            key={field}
        />);
    }

    return <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {formControls}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="link" onClick={onDelete} className="mr-auto text-danger">
                Delete
            </Button>
            <Button variant="outline-secondary" onClick={onHide}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateRecordClick}>
                Update Record
            </Button>
        </Modal.Footer>
    </Modal>
}

function RecordField({ fieldName, value, setValue }) {
    if (typeof value === 'boolean') {
        const onChangeCheckbox = event => setValue(!value);
        const id = `edit-${fieldName}`;
        return <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" checked={value} onChange={onChangeCheckbox} id={id}/>
            <label className="custom-control-label" htmlFor={id}>{camelCaseToTitle(fieldName)}</label>
        </div>
    }

    const onChange = event => setValue(event.target.value);
    return <div className="form-group">
        <label>{camelCaseToTitle(fieldName)}</label>
        <input type="text" className="form-control" value={value} onChange={onChange}/>
    </div>
}

function CrudRow({ record, editRecord }) {
    const values = [];

    for (const key in record) {
        if (key === 'id') {
            continue;
        }

        const value = record[key];
        values.push(<td key={key}><CrudValue value={value}/></td>)
    }

    const handleDoubleClick = useCallback((event) => {
        event.preventDefault();
        editRecord(record);
    }, [record, editRecord]);

    return <tr onDoubleClick={handleDoubleClick}>
        {values}
    </tr>
}

function CrudValue({ value }) {
    const timestamp = Date.parse(value);
    if (isNaN(timestamp) === false) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }
    if (typeof value === 'boolean') {
        return <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck1" disabled checked={value}/>
                <label className="custom-control-label" htmlFor="customCheck1"></label>
        </div>
    }

    return value;
}

function AppNavbar() {
    // Use the `useCurrentUser()` react hook to access the current logged in user
    const user = useCurrentUser();

    // This navbar requires bootstrap js helpers for the dropdown
    // If the dropdown is not working, you like removed the bootstrap JS from your index.html

    return <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {user?.email}
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#" onClick={() => logout()}>Logout</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
}

// This needs to be run before any calls to `query`, `createRecord`, etc.
initIHPBackend({ host: process.env.BACKEND_URL });

// Start the React app
ReactDOM.render(<App/>, document.getElementById('app'));
