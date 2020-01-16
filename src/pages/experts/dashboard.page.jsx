import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";
import { wrapper } from "state";
import { Tabs, Tab, Card, Classes, EditableText, Button, Intent } from "@blueprintjs/core";
import Offerings from "./offerings"
import Info from "./info"
import Opinions from "./opinions"

const getUser = (id, http) => http({ method: 'get', url: `http://localhost:1337/users/${id}` }).then(r => r.data)
const getOfferings = (http) => http({ method: 'get', url: `http://localhost:1337/offerings?_sort=created_at:desc` }).then(r => r.data)
const getOpinions = (http) => http({ method: 'get', url: `http://localhost:1337/opinions` }).then(r => r.data)

const Profile = (prop) => {
    const { http, useGlobalState, requests } = prop;
    const [ currentUser ] = useGlobalState('user');
    const [ , updateSuccess ] = useGlobalState('success');
    
    const [ tab, updateTab ] = useState("Info");
    const [ isEditing, updateIsEditing ] = useState(false);
    const [ username, updateUsername ] = useState("");
    const [ aboutme, updateAboutme ] = useState("");

    useEffect(() => {
        requests.user.getUser(currentUser.id)
    }, []);

    const update = (id) => () =>{
        const data = { username, aboutme }
        http({ method: 'put', url: `http://localhost:1337/users/${id}`, data })
        .then(() => {updateIsEditing(false); updateSuccess('Information updated!')});
    }

    return ( currentUser !== null && currentUser.role.type !== 'expert') ? <Redirect to="/" /> : (
        <>
        <Card style={{ display: 'flex', marginBottom: '1.5rem' }} className={currentUser === null ? Classes.SKELETON: ''}>
            <div>
                <img src="http://lorempixel.com/200/200/" alt=""/>
            </div>
            <div style={{ marginLeft: '1rem'}}>
                <h2>
                    {currentUser === null ? null: (
                        <EditableText onChange={(v) => {updateIsEditing(true);updateUsername(v)}} defaultValue={currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)} />
                    )}
                </h2>
                <p>
                    {currentUser === null ? null: (
                        <EditableText onChange={(v) => {updateIsEditing(true);updateAboutme(v)}} multiline={true} defaultValue={currentUser.aboutme} />
                    )}
                </p>
            </div>
            {isEditing ? <Button intent={Intent.PRIMARY} onClick={update(currentUser.id)} style={{ marginLeft: 'auto', alignSelf: 'start'}} text="Update"/> : null}
        </Card>
        <Card style={{ height: 'auto' }}>
            <Tabs
                animate={true}
                id="navbar"
                large={false}
                onChange={(id) => updateTab(id)}
                renderActiveTabPanelOnly={true}
                selectedTabId={tab}
            >
                <Tab id="Info" title="Info" panel={currentUser ? <Info user={currentUser}/> : null} />
                <Tab id="Offerings" title="Offerings" panel={<Offerings user={currentUser}/>} />
                <Tab id="Opinions" title="Opinions" panel={<Opinions user={currentUser}/>} />
            </Tabs>
        </Card>
        </>
    );
}

export default wrapper(Profile);