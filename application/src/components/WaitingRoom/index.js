import React from 'react';
import 'firebase/firestore';
import { firestore } from 'firebase';
export default class WaitingRoom extends React.Component {
    constructor(props){
        super(props);
        this.db = firestore();
        this.state = {
            users: ( async function(){
                await createUserList();
        })}
    }

    render(){
        return <div>
            <ul>
                <h2>This is where the users would go</h2>
                {/* {this.state.users.map(user=>{
                    return <li>{user}</li>
                })} */}
            </ul>
        </div>
    }
};
async function createUserList(){
    var usernames = [];
    const users = await firestore().collection('users').get().then((col)=>{
        col.forEach(doc=>{
            usernames.push(doc.get('username'));
        })
    });
    return usernames;
}