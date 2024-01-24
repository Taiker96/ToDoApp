import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from '../../constants';
import { todoListType } from "../../types";
import moment from 'moment';

const items = {
  borderRadius: 4,
  backgroundColor: colors?.orange,
  fontSize: '21px',
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 8,
  },
  inputID: {
    width: '10%',
    marginEnd: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    ...items,
  },
  inputName: {
    width: '90%',
    paddingVertical: 12,
    paddingStart: 12,
    ...items,
  },
  actionIcon: {
    position: 'absolute',
    flexDirection: 'row',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  timeText: {
    position: 'absolute',
    top: 2,
    left: 4,
    fontSize: 9,
    color: '#ab5656',
    fontWeight: 'bold'
  }
});

interface listProps {
  data: todoListType[];
  onEdit: (item: object) => void;
  onDel: (item: object) => void;
}

export default function App(props: listProps) {
  const { data, onEdit, onDel } = props;

  const renderList = () => {
    const result = data && data.map((item: todoListType) => {
      const { id, text, dateTime } = item;
      return <View key={id} style={styles.taskItem}>
        <View style={styles.inputID}><Text>{id}</Text></View>
        <View style={styles.inputName}>
          {dateTime && <Text style={styles.timeText} numberOfLines={1}>{moment(dateTime).format('HH:mm - DD-MM-YYYY')}</Text>}
          <Text numberOfLines={3}>{text}</Text>
        </View>
        <View style={styles.actionIcon}>
          <TouchableOpacity onPress={() => onEdit && onEdit(item)} style={{ paddingEnd: 12 }}>
            <Icon name={'pen'} size={16} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDel && onDel(item)}>
            <Icon name={'trash'} size={16} />
          </TouchableOpacity>
        </View>
      </View>;
    });
    return result;
  };

  return (
    <View>{renderList()}</View>
  );
}
