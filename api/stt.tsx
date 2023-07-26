import React, { Component, useEffect, useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Button,
} from "react-native"

import Voice, { SpeechResultsEvent } from "@react-native-voice/voice"
import { SafeAreaView } from "react-native-safe-area-context"

export default function VoiceInput() {
  let [started, setStarted] = useState(false)
  let [results, setResults] = useState<string[]>([])
  useEffect(() => {
    Voice.onSpeechError = onSpeechError
    Voice.onSpeechResults = onSpeechResults
    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])
  const onSpeechResults = (results: SpeechResultsEvent) => {
    setResults(results.value ?? [])
  }
  const onSpeechError = (error: any) => {
    console.log(error)
  }
  const startSpeechToText = async () => {
    try {
      await Voice.start("en-IN")
    } catch (error) {
      console.log(error)
    }
    setStarted(true)
  }
  const stopSpeechToText = async () => {
    await Voice.stop
    setStarted(false)
  }
  return (
    <SafeAreaView>
      <View>
        {!started ? (
          <Button
            title="Start"
            onPress={startSpeechToText}
          ></Button>
        ) : undefined}

        {!started ? (
          <Button
            title="Stop"
            onPress={stopSpeechToText}
          ></Button>
        ) : undefined}
        {results.map((result, index) => (
          <Text key={index}>{result}</Text>
        ))}
      </View>
    </SafeAreaView>
  )
}
