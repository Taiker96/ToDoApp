import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import { RequiredText, YesNoModal } from "../../common";
import Config from "../../config";
import { colors, localize } from "../../constants";
import { PickerMode, todoListType, DateType } from "../../types";
import ToDoList from "./ToDoList";

const styles = StyleSheet.create({
  spacingBottom: {
    marginBottom: 16
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#ooo',
    marginStart: 8,
    marginEnd: 12,
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  AddArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    marginVertical: 12,
  },
  todoText: {
    position: 'relative',
    width: '100%',
    flex: 1,
    height: 40,
    borderWidth: 1,
    padding: 8,
    paddingEnd: 44,
  },
  btnForm: {
    position: 'absolute',
    fontSize: 24,
    right: 2,
    top: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors?.disabled,
  },
  dateTimeInput: {
    color: colors?.black,
    backgroundColor: 'yellow',
    borderBottomWidth: 1,
    borderBottomColor: colors?.black,
  },
  btnAdd: {
    position: 'absolute',
    top: 2,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors?.info,
  }
});

const defaultMode = 'view';
const defaultInfo = {
  text: "",
  dateTime: null,
};
const textWhite = { style: { color: colors?.white } };

type ModeType = 'add' | 'edit' | 'view';
interface ErrorState {
  [key: string]: boolean
};

const dateTimeList = new Map([
  ['date', { format: 'YYYY-MM-DD' }],
  ['time', { format: 'HH:mm:ss' }]
]);

export default function App() {
  const [todoList, setTodoList] = useState<Array<todoListType> | []>([]);
  const [openDelModal, setOpenDelModal] = useState<boolean>(false);
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
  const [mode, setMode] = useState<ModeType>(defaultMode);
  const [error, setError] = useState<ErrorState>({});
  const [dataMaster, setDataMaster] = useState<todoListType>(defaultInfo);
  const indexKey = useRef<number>(0);
  const dateMode = useRef<PickerMode>("date");
  const itemInfo = useRef<todoListType>({});
  const infoDel = useRef<todoListType>({});
  const disabled = mode === "view";

  const onSent = () => {
    const errArr = [];
    for (const [key, value] of Object.entries(dataMaster)) {
      if (Config.isEmpty(value)) errArr.push(key);
    }
    if (!Config.isEmpty(errArr)) {
      const errorObj = errArr.reduce((a, v) => ({ ...a, [v]: true }), {});
      setError(errorObj);
      return;
    }

    let data = [...todoList];
    if (!Config.isEmpty(itemInfo.current)) {  // EDIT
      data[itemInfo.current.id!] = { ...data[itemInfo.current.id!], ...dataMaster };
    } else {  // ADD
      data = [...data, {
        id: indexKey.current++,
        ...dataMaster
      }];
    }
    setTodoList(data);
    onResetForm();
  };

  const onResetForm = (modeName: ModeType = defaultMode) => {
    itemInfo.current = {};
    setMode(modeName);
    setError({});
    setDataMaster(defaultInfo);
  };

  const onEdit = (data: todoListType) => {
    if (Config.isEmpty(data?.id)) return;
    itemInfo.current = data;
    setMode('edit');
    setDataMaster(data || {});
  };

  const onAdd = () => {
    onResetForm('add');
  };

  const onOpenModal = (data = {}) => {
    infoDel.current = data;
    setOpenDelModal(true);
  };

  const onDel = (isYes = false) => {
    if (isYes) {
      const { id } = infoDel.current;
      if (Config.isEmpty(id)) return;
      let index = 0;
      const dataList = [];
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i]?.id === id) continue;
        dataList.push({ ...todoList[i], id: index++ });
      }
      indexKey.current = dataList.length;
      setTodoList(dataList);
      if (indexKey.current === 0 || id === dataMaster.id) onResetForm();
    } else {
      infoDel.current = {};
    }
    setOpenDelModal(false);
  };

  const onChange = (key: string, e: any) => {
    let value = e;
    if (key === 'dateTime') {
      value = e?.nativeEvent?.timestamp ?? null;
      const time01 = dateMode.current === 'date' ? value : dataMaster['dateTime'];
      const time02 = dateMode.current === 'time' ? value : dataMaster['dateTime'];
      value = Config.toTimestamp(time01, time02);
      setOpenDatePicker(false);
    }
    setDataMaster({
      ...dataMaster,
      [key]: value,
    });
  };

  const dateTimeValue = useCallback((name: PickerMode) => {
    let formatType = "";
    switch (name) {
      case 'date':
        formatType = 'DD-MM-YYYY';
        break;
      case 'time':
        formatType = 'HH:mm';
        break;
      default:
        break;
    }
    const result = dataMaster.dateTime ? moment(dataMaster.dateTime).format(formatType) : "";
    return result;
  }, [dataMaster.dateTime]);


  const onChangeDateTime = (name: PickerMode): void => {
    dateMode.current = name;
    setOpenDatePicker(true);
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* <ImageBackground source={{ uri: 'https://taiker96.netlify.app/assets/images/bg.jpg' }} resizeMode={"cover"} style={styles.image} ></ImageBackground> */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', position: 'relative' }}>
        <Text style={styles.title}>TodoList</Text>
        <TouchableOpacity style={styles.btnAdd} onPress={onAdd}><Text {...textWhite}>{localize.add}</Text></TouchableOpacity>
      </View>
      <ToDoList data={todoList} onEdit={onEdit} onDel={(e) => onOpenModal(e)} />
      <YesNoModal
        open={openDelModal}
        type={"YES_NO"}
        title={localize.del}
        onAction={(isYes) => onDel(isYes)}
      />
      <View style={styles.AddArea}>
        <View style={{ ...styles.spacingBottom, flexDirection: 'row' }}>
          {openDatePicker && <DateTimePicker
            mode={dateMode.current}
            value={dataMaster.dateTime ? new Date(dataMaster.dateTime) : new Date()}
            onChange={(e: any) => onChange('dateTime', e)}
          />}
          <TouchableOpacity style={{ flex: 1, marginRight: 12 }} onPress={() => onChangeDateTime('date')}>
            <TextInput
              readOnly
              style={styles.dateTimeInput}
              value={dateTimeValue('date')}
              placeholder={"DD-MM-YYYY"}
            />
            <RequiredText error={error?.['dateTime']} />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => onChangeDateTime('time')}>
            <TextInput
              readOnly
              style={styles.dateTimeInput}
              value={dateTimeValue('time')}
              placeholder={"HH:SS"}
            />
            <RequiredText error={error?.['dateTime']} />
          </TouchableOpacity>
        </View>
        <View style={{ position: 'relative', flex: 1 }}>
          <TextInput
            style={styles.todoText}
            onChangeText={(e: any) => onChange('text', e)}
            value={dataMaster?.text}
            placeholder={"Add Task"}
          />
          <TouchableOpacity style={styles.btnForm} onPress={onSent}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <RequiredText error={error?.['text']} />
      </View>
    </SafeAreaView>
  );
}
