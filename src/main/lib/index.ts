import { appDirectoryName, fileEncoding, WelcomeNoteFilename } from "@shared/constants"
import { NoteInfo } from "@shared/models"
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from "@shared/types"
import { dialog } from "electron"
import { ensureDir, readdir, readFile, remove, stat, writeFile } from "fs-extra"
import { isEmpty } from "lodash"
import { homedir } from "os"
import path from "path"
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
    return path.join(homedir(), appDirectoryName)
}

export const getNotes: GetNotes = async () => {
    const rootDir = getRootDir()

    await ensureDir(rootDir)

    const notesFileNames = await readdir(rootDir, {
        encoding: fileEncoding,
        withFileTypes: false
    })

    const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

    if(isEmpty(notes)) {
        console.info('No Notes found, creating a welcome note')

        const content = await readFile(welcomeNoteFile, {encoding: fileEncoding})

        // create teh welcome note
        await writeFile(path.join(rootDir, WelcomeNoteFilename), content, {encoding: fileEncoding})

        notes.push(WelcomeNoteFilename)
    }

    return Promise.all(notes.map(getNoteInfoFromFileName))
}

export const getNoteInfoFromFileName = async (filename: string): Promise<NoteInfo> => {
    const fileStats = await stat(`${getRootDir()}/${filename}`)

    return {
        title: filename.replace(/\.md$/, ''),
        lastEditTime: fileStats.mtimeMs
    }
}

export const readNote: ReadNote = async (filename) => {
    const rootDir = getRootDir()
    return readFile(`${rootDir}/${filename}.md`, {encoding: fileEncoding})
}

export const writeNote: WriteNote = async (filename, content) => {
    const rootDir = getRootDir()

    console.info(`Writing note ${filename}`)

    return writeFile(`${rootDir}/${filename}.md`, content, {encoding: fileEncoding})
}

export const createNote: CreateNote = async () => {
    const rootDir = getRootDir()
    
    await ensureDir(rootDir)

    const {filePath, canceled} = await dialog.showSaveDialog({
        title: 'New Note',
        defaultPath: path.join(rootDir, 'Untitled'),
        buttonLabel: 'Create',
        properties: ['showOverwriteConfirmation'],
        showsTagField: false,
        filters: [{name: 'Markdown', extensions: ['md']}],
    })

    if(canceled || !filePath) {
        console.info('Note creation canceled')
        return false
    }

    const {name: filename, dir: parentDir} = path.parse(filePath)

    if(parentDir !== rootDir) {
        await dialog.showMessageBox({
            type: 'error',
            title: 'Creation failed',
            message: `All notes must be saved under ${rootDir}. Avoid using other directories!`
        })

        return false
    }

    console.info(`Creating note ${filePath}`)
    await writeFile(filePath, '')

    return filename
}

export const deleteNote: DeleteNote = async (filename) => {
    const rootDir = getRootDir()
    console.log(rootDir)
    
    const { response } = await dialog.showMessageBox({
        type: 'warning',
        title: 'Delete Note',
        message: `Are you sure you want to delete ${filename}?`,
        buttons: ['Delete', 'Cancel'],
        defaultId: 1,
        cancelId: 1
    })

    if(response === 1) {
        console.info('Note deletion cancelled')
        return false
    }

    console.info(`Deleting note: ${filename}`)
    await remove(path.join(rootDir, `${filename}.md`))
    return true
}