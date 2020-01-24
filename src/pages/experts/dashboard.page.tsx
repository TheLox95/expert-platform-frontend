import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { wrapper, WrappedComponent } from "state";
import { Tabs, Tab, Card, Classes, EditableText, Button, Intent } from "@blueprintjs/core";
import Offerings from "./offerings"
import Info from "./info"
import Opinions from "./opinions"

const Profile: WrappedComponent = ({ http, useGlobalState, requests, i18n }) => {
    const [ currentUser ] = useGlobalState('user');
    const [ , updateSuccess ] = useGlobalState('success');
    
    const [ tab, updateTab ] = useState("Info");
    const [ isEditing, updateIsEditing ] = useState(false);
    const [ username, updateUsername ] = useState("");
    const [ aboutme, updateAboutme ] = useState("");

    useEffect(() => {
        requests.user.getUser(currentUser?.id)
    }, []);

    const update = (id?: number) => () =>{
        if (!id) return;
        const data = { username, aboutme }
        http({ method: 'put', url: `${process.env.REACT_APP_BACKEND_URL}/users/${id}`, data })
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
            {isEditing ? <Button intent={Intent.PRIMARY} onClick={update(currentUser?.id)} style={{ marginLeft: 'auto', alignSelf: 'start'}} text="Update"/> : null}
        </Card>
        <Card style={{ height: 'auto' }}>
            <Tabs
                animate={true}
                id="navbar"
                large={false}
                onChange={(id) => updateTab(id as string)}
                renderActiveTabPanelOnly={true}
                selectedTabId={tab}
            >
                <Tab id="Info" title={i18n.t('info')} panel={<Info user={currentUser}/>} />
                <Tab id="Offerings" title={i18n.t('offerings')} panel={<Offerings />} />
                <Tab id="Opinions" title={i18n.t('opinions')} panel={<Opinions user={currentUser}/>} />
            </Tabs>
        </Card>
        </>
    );
}

export default wrapper(Profile);