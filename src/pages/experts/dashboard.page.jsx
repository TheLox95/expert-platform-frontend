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
    const { http, useGlobalState } = prop;
    const [ currentUser ] = useGlobalState('user');
    const [ , updateSuccess ] = useGlobalState('success');
    
    const [ tab, updateTab ] = useState("Info");
    const [ user, updateUser ] = useState(null);
    const [ isEditing, updateIsEditing ] = useState(false);
    const [ username, updateUsername ] = useState("");
    const [ aboutme, updateAboutme ] = useState("");

    useEffect(() => {
        axios.all([
            getUser(currentUser.id, http),
            getOfferings(http),
            getOpinions(http)
        ])
        .then(axios.spread((user, offerings, opinions) => {
            offerings = offerings.map(offering => {
                offering.opinions = offering.opinions.map(originalOpinion => {
                    return opinions.filter(fullOpiniion => fullOpiniion.user.id === originalOpinion.user)
                }).flat()
                return offering;
            })
            user = {
                ...user,
                offerings
            }
            updateUsername(user.username)
            updateAboutme(user.aboutme)
            updateUser(user)
        }))
    }, [currentUser.id, http]);

    const update = (id) => () =>{
        const data = { username, aboutme }
        http({ method: 'put', url: `http://localhost:1337/users/${id}`, data })
        .then(() => {updateIsEditing(false); updateSuccess('Information updated!')});
    }

    return ( user !== null && user.role.type !== 'expert') ? <Redirect to="/" /> : (
        <>
        <Card style={{ display: 'flex', marginBottom: '1.5rem' }} className={user === null ? Classes.SKELETON: ''}>
            <div>
                <img src="http://lorempixel.com/200/200/" alt=""/>
            </div>
            <div style={{ marginLeft: '1rem'}}>
                <h2>
                    {user === null ? null: (
                        <EditableText onChange={(v) => {updateIsEditing(true);updateUsername(v)}} defaultValue={user.username.charAt(0).toUpperCase() + user.username.slice(1)} />
                    )}
                </h2>
                <p>
                    {user === null ? null: (
                        <EditableText onChange={(v) => {updateIsEditing(true);updateAboutme(v)}} multiline={true} defaultValue={user.aboutme} />
                    )}
                </p>
            </div>
            {isEditing ? <Button intent={Intent.PRIMARY} onClick={update(user.id)} style={{ marginLeft: 'auto', alignSelf: 'start'}} text="Update"/> : null}
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
                <Tab id="Info" title="Info" panel={user ? <Info user={user}/> : null} />
                <Tab id="Offerings" title="Offerings" panel={<Offerings user={user}/>} />
                <Tab id="Opinions" title="Opinions" panel={<Opinions user={user}/>} />
            </Tabs>
        </Card>
        </>
    );
}

export default wrapper(Profile);