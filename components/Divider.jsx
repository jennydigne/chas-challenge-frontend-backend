import { View, Text, StyleSheet } from 'react-native';

export default function Divider({ text = "or", paddingHorizontal = 40, marginTop, marginBottom, lineColor = "#C8C8C8" }) {
    return (
        <View style={[styles.container, { paddingHorizontal, marginTop, marginBottom }]}>
            <View style={[styles.line, { backgroundColor: lineColor }]} />
            {text ? <Text style={styles.text}>{text}</Text> : null}
            <View style={[styles.line, { backgroundColor: lineColor }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    line: {
        flex: 1,
        height: 1,
    },
    text: {
        marginHorizontal: 12,
        color: '#000000',
        fontSize: 16,
    },
});


