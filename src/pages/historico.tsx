import HistoryList from '@/components/HistoryList'
import Layout from '@/components/Layout'
import { useTextToAudio } from '@/hooks/useTextToAudio'
import React from 'react'

type Props = {}

const Historico = (props: Props) => {
  const { history, handleDeleteFromHistory } = useTextToAudio()
  return (
    <Layout>
      <HistoryList history={history} onDelete={handleDeleteFromHistory}/>
    </Layout>
      
  )
}

export default Historico