import PropTypes from "prop-types";
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, localize } from '../constants';
import { modalProps } from '../types';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        marginBottom: 12
    },
    viewBtn: {
        flexDirection: 'row'
    },
    button: {
        borderRadius: 20,
        padding: 12,
        elevation: 2,
    },
    buttonInfo: {
        marginEnd: 8,
        color: colors?.white,
        backgroundColor: colors?.info,
    },
    buttonNo: {
        borderWidth: 1,
        borderColor: `${colors?.info}`,
        backgroundColor: `${colors?.disabled}`,
    }
});

export default function App(props: modalProps) {
    const { title, type, open, onAction } = props;

    const btnAction = (status: boolean = false) => {
        onAction && onAction(status);
    };

    const renderButton = () => {
        let btnView = <Pressable
            style={[styles.button, styles.buttonInfo]}
            onPress={() => btnAction()}>
            <Text>OK</Text>
        </Pressable>
        if (type === "YES_NO") btnView = <View style={styles.viewBtn}>
            <Pressable
                style={[styles.button, styles.buttonInfo]}
                onPress={() => btnAction(true)}>
                <Text style={{ color: colors?.white }}>{localize.ok}</Text>
            </Pressable>
            <Pressable
                style={[styles.button, styles.buttonNo]}
                onPress={() => btnAction()}>
                <Text style={{ color: colors?.info }}>{localize.no}</Text>
            </Pressable>
        </View>
        return btnView;
    };

    return (
        <Modal
            transparent
            animationType={"slide"}
            visible={open}
            onRequestClose={() => btnAction()}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>{title}</Text>
                    {renderButton()}
                </View>
            </View>
        </Modal>
    );
}

App.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    type: PropTypes.string,
    onAction: PropTypes.func,
};

App.defaultProps = {
    open: false,
    title: "",
    type: "INFO"
};
