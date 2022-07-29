import { Text, View } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Icon } from 'react-native-elements';
import { map } from 'lodash';
import { Modal } from '../Shared/Modal/Modal';
import { ChangeNameForm } from '../../screens/Account/ChangeNameForm';
import { ChangeEmailForm } from '../../screens/Account/ChangeEmailForm';
export function AccountOptions(props) {
    const {setUserInfo} = props;
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)
    const onCloseOpneModal = () => setShowModal((prevState) => !prevState)


    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(<ChangeNameForm onClose={onCloseOpneModal} setUserInfo={setUserInfo}/>)
                break;
        
            //case "email":
            //   setRenderComponent(<ChangeEmailForm onClose={onCloseOpneModal} setUserInfo={setUserInfo} />)
            
            //    break;
    
            case "password":
                setRenderComponent(<Text>Change your password</Text>)
        
                break;
                    
            default:
                break;
        }

        onCloseOpneModal();
    };
    const menuOption = getMenuOption(selectedComponent);


    return (
      <View>
        {map(menuOption, (menu, index) => (
            <ListItem key={index} bottomDivider onPress={menu.onPress}>
                <Icon 
                    type={menu.iconType}
                    name={menu.iconNameLeft}
                    color={menu.iconColorLeft}
                />
                <ListItem.Content>
                    <ListItem.Title>{menu.title}</ListItem.Title>    
                </ListItem.Content> 
                <Icon
                    type={menu.iconType}
                    name={menu.iconNameRight}
                    color={menu.iconColorRight}
                />
            </ListItem>
        ))}
        <Modal show={showModal} close={onCloseOpneModal}>
            {renderComponent}
        </Modal>
      </View>
    )
}

function getMenuOption(selectedComponent){
    return[
        {
            title: "Cambiar Nombre",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("displayName")
        },
        /*
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("email")
        },*/
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("password")
        },
    ];
}