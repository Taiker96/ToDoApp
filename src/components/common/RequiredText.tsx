
import { Text } from "react-native";
import { colors, localize } from '../constants';

interface errorType {
    error: boolean | string;
}

export default function App(props: errorType) {
    const { error } = props;
    return !!error && <Text style={{ color: colors.danger }}>{localize.requiredQuote}</Text>;
};