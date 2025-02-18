import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { hp } from '../helpers/common'

const Input = () => {
  return (
    <View style={[styles.container, props.containerStyles && props.containerStyles]}>
      {
        props.icon && props.icon
      }
      <TextInput
      style={{flex: 1}}
      placeholderTextColor={theme.colors.textLight}
      ref = {props.inputRef && props.inputRef}
      {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        borderWidth: 0.4,
        justifyContent: 'center',
        borderRadius: theme.radius.xxl,
        borderColor: theme.colors.text,
        borderCurve: 'continuous',
        gap: 12,
        paddingHorizontal: 18
    }
})