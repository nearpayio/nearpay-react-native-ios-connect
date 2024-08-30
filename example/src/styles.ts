import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginLeft: 12,
    marginTop: 12,
    elevation: 3,
    backgroundColor: 'black',
    height: 45,
    width: 150,
  },
  smallButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    elevation: 3,
    backgroundColor: 'black',
    height: 25,
    width: 70,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 12,
    lineHeight: 21,
    alignContent: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    color: 'white',
  },
  smallText: {
    fontSize: 10,
    lineHeight: 21,
    alignContent: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    color: 'white',
  },
  selectableText: {
    fontSize: 12,
    lineHeight: 30,
    letterSpacing: 0.25,
    color: 'gray',
    fontWeight: 'bold',
  },
  label: {
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 50,
    marginBottom: 20,
    fontSize: 26,
    backgroundColor: 'oldlace',
    fontWeight: '900',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  selectedLabel: {
    color: 'white',
  },
});

export default styles;
