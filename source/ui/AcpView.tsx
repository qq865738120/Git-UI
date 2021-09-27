import React, { FC, useEffect, useState } from "react"
import { Box, Newline, Text, useApp } from "ink"
import TextInput from "ink-text-input"
import ProgressBar from "ink-progress-bar"
import shell from "shelljs"
// import logSymbols from "log-symbols"

const AcpView: FC = () => {
	const [submitMessage, setSubmitMessage] = useState("")
	const [tasks, setTasks] = useState([] as ((params?: any) => string)[])
	const [taskDone, setTaskDone] = useState([] as ((params?: any) => string)[])
	const [progressText, setProgressText] = useState("")
	const { exit } = useApp()

	useEffect(() => {
		setTasks([
			() => "git add .",
			message => `git commit -m "${message}"`,
			() => "git push",
		])
	}, [])

	const onInputSubmit = () => {
		tasks.map((task, index) => {
			const result = shell.exec(index === 1 ? task(submitMessage) : task(), {
				silent: true,
			})
			if (result.code === 0) {
				setProgressText(task().substring(0, 8))
				setTaskDone(taskDone.concat([task]))
				console.log("taskDone", taskDone)
			} else {
				exit(new Error(result.stderr))
			}
		})
	}

	return (
		<Box>
			<Box>
				<Text>请输入提交信息：</Text>
				<TextInput
					value={submitMessage}
					onChange={setSubmitMessage}
					onSubmit={onInputSubmit}
				/>
			</Box>
			<Newline count={2} />
			<Box>
				<Text>{progressText}</Text>
				<ProgressBar
					left={progressText.length}
					percent={taskDone.length / tasks.length}
				/>
			</Box>
		</Box>
	)
}

export default AcpView
