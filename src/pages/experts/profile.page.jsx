import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";
import { wrapper } from "state";
import { Tabs, Tab, Card, Classes } from "@blueprintjs/core";
import { useParams } from "react-router-dom";
import Offerings from "./offerings"
import Info from "./info"
import Opinions from "./opinions"

const getUser = (id, http) => http({ method: 'get', url: `http://localhost:1337/users/${id}` }).then(r => r.data)
const getOfferings = (http) => http({ method: 'get', url: `http://localhost:1337/offerings?_sort=created_at:desc` }).then(r => r.data)
const getOpinions = (http) => http({ method: 'get', url: `http://localhost:1337/opinions` }).then(r => r.data)

const Profile = (prop) => {
    const { id } = useParams();
    const { http, useGlobalState } = prop;
    const [tab, updateTab] = useState("Info");
    const [ loggedUser, updateLoggedUser ] = useGlobalState('user');

    useEffect(() => {
        axios.all([
            getUser(id, http),
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
            updateLoggedUser(user)
        }))
    }, [id, http]);

    return ( loggedUser !== null && loggedUser.role.type !== 'expert') ? <Redirect to="/" /> : (
        <>
        <Card style={{ display: 'flex', marginBottom: '1.5rem' }} className={loggedUser === null ? Classes.SKELETON: ''}>
            <div>
                <img src="http://lorempixel.com/200/200/" alt=""/>
            </div>
            <div style={{ marginLeft: '1rem'}}>
                <h2>{loggedUser ? loggedUser.username.charAt(0).toUpperCase() + loggedUser.username.slice(1): ''}</h2>
                <p>{loggedUser?.aboutme}</p>
            </div>
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
                <Tab id="Info" title="Info" panel={loggedUser ? <Info user={loggedUser}/> : null} />
                <Tab id="Offerings" title="Offerings" panel={<Offerings user={loggedUser}/>} />
                <Tab id="Opinions" title="Opinions" panel={<Opinions user={loggedUser}/>} />
            </Tabs>
        </Card>
        </>
    );
}

export default wrapper(Profile);