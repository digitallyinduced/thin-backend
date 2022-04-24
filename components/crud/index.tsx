import React, { useState, useCallback, ChangeEventHandler } from 'react';
import { createRecord, updateRecord, deleteRecord, TableName, QueryBuilder, IHPRecord } from 'thin-backend';
import { useQuery } from 'thin-backend/react';
import { Button, Modal } from 'react-bootstrap';
import './crud.css';

interface CrudProps<table extends TableName> {
    query: QueryBuilder<table, IHPRecord<table>>;
}

export function Crud<table extends TableName>({ query }: CrudProps<table>) {
    const records = useQuery(query);
    const [showNewRecordModal, setShowNewRecordModal] = useState(false);
    const [editRecord, setEditRecord] = useState((null as IHPRecord<table> | null));

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

function camelCaseToTitle(camelCaseString: string) {
    const result = camelCaseString.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

interface NewRecordModalProps {
    table: TableName;
    show: boolean;
    setShow: (show: boolean) => void;
    fieldNames: Array<string>
}
function NewRecordModal({ table, show, setShow, fieldNames }: NewRecordModalProps) {
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
                    value={(newRecord as any)[fieldName] || ''}
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

interface EditRecordModalProps<table> {
    table: TableName;
    show: boolean;
    onHide: () => void;
    record: IHPRecord<table> | null;
}
function EditRecordModal<table>({ table, show, onHide, record }: EditRecordModalProps<table>) {
    const handleCreateRecordClick = () => {
        if (record === null) return;

        updateRecord(table, record.id, patch);
        onHide();
        setPatch({});
    }
    const [patch, setPatch] = useState({} as Partial<IHPRecord<table>>);
    const onDelete = () => {
        if (record === null) return;

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
            value={field in patch ? (patch as any)[field] : record[field]}
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

interface RecordFieldProps<value> {
    fieldName: string;
    value: value;
    setValue: (value: value) => void;
}
function RecordField<value>({ fieldName, value, setValue }: RecordFieldProps<value>) {
    if (typeof value === 'boolean') {
        // @ts-expect-error
        const onChangeCheckbox = (event: any) => setValue(!value);
        const id = `edit-${fieldName}`;
        return <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" checked={value} onChange={onChangeCheckbox} id={id}/>
            <label className="custom-control-label" htmlFor={id}>{camelCaseToTitle(fieldName)}</label>
        </div>
    }

    // @ts-expect-error
    const onChange: ChangeEventHandler<HTMLInputElement> = event => setValue(event.target.value);
    return <div className="form-group">
        <label>{camelCaseToTitle(fieldName)}</label>
        <input type="text" className="form-control" value={value as any} onChange={onChange}/>
    </div>
}

interface CrudRowProps<table> {
    record: IHPRecord<table>;
    editRecord: (record: IHPRecord<table>) => void;
}
function CrudRow<table>({ record, editRecord }: CrudRowProps<table>) {
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

interface CrudValueProps {
    value: any;
}
function CrudValue({ value }: CrudValueProps) {
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
