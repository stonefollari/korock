import React, { useEffect } from 'react'
import { getBlocks } from '../api/block'
import { err } from '../utils/functions'

export default function Board(): JSX.Element {
  const groupId = 1

  useEffect(() => {
    getBlocks(groupId)
      .then((res) => {
        console.log(res.data)
      })
      .catch((e) => err(e))
  }, [])

  return <></>
}
