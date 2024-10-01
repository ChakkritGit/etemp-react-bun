import { memo, useEffect, useState } from "react"
import './css.css'
import DataTable, { TableColumn } from "react-data-table-component"
import { SubWardColumnFlex } from "../../style/style"
import { Modal } from "react-bootstrap"
import { RootState } from "../../stores/store"
import { useSelector } from "react-redux"
import { devicesType } from "../../types/device.type"
import { notificationType } from "../../types/notification.type"

function Test() {
  const [cardActive, setCardActive] = useState('')
  const [show, setShow] = useState(false)
  const [newFilter, setNewFilter] = useState<devicesType[]>([])
  const { devices } = useSelector((state: RootState) => state.devices)
  const devicesFilter = useSelector((state: RootState) => state.arraySlice.device.devicesFilter)
  const { wardId } = useSelector((state: RootState) => state.utilsState)

  const filter: devicesType[] = wardId !== '' ? devicesFilter.filter((f) => f.wardId.toLowerCase().includes(wardId.toLowerCase())) : devices

  const getSum = (key: keyof NonNullable<devicesType['_count']>): number =>
    filter.reduce((acc, devItems) => acc + (devItems._count?.[key] ?? 0), 0)

  const getFilteredCount = (predicate: (n: notificationType) => boolean): number =>
    filter.flatMap(i => i.noti).filter(predicate).length

  useEffect(() => {
    console.log('new data incomming...')
    if (cardActive === '1') {
      setNewFilter(devices.filter(dev => dev.noti.some(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1]))))
    } else if (cardActive === '2') {
      setNewFilter(filter.filter(dev => dev.noti.some(n => n.notiDetail.split('/')[0].startsWith('PROBE'))))
    } else {
      setNewFilter(filter.filter(dev => dev._count?.log))
    }
  }, [cardActive, devices])

  const openModal = () => {
    setShow(true)
  }

  const closeModal = () => {
    setShow(false)
  }

  const columns: TableColumn<devicesType>[] = [
    {
      name: 'title',
      selector: (i) => i.devDetail,
      center: false,
      sortable: false
    }
  ]

  const subWardColumns: TableColumn<notificationType>[] = [
    {
      name: 'title',
      selector: (i) => i.devSerial,
      center: false,
      sortable: false
    },
    {
      name: 'action',
      cell: () => <button onClick={openModal}>Click</button>,
      center: false,
      sortable: false
    }
  ]

  const ExpandedComponent = memo(({ data }: { data: devicesType }) => (
    <SubWardColumnFlex>
      <DataTable
        columns={subWardColumns}
        data={data.noti}
        responsive
      />
    </SubWardColumnFlex>
  ))

  return (
    <div className="mainContainer">
      <div className="cardContainer">
        <div
          className={`card ${cardActive === '1' && 'active'}`}
          onClick={() => {
            if (cardActive === '1') {
              setCardActive('')
            } else {
              setCardActive('1')
            }
          }}>
          <span>{getFilteredCount(n => ['LOWER', 'OVER'].includes(n.notiDetail.split('/')[1]))}</span>
          <span>Temperature</span>
        </div>
        <div className={`card ${cardActive === '2' && 'active'}`}
          onClick={() => {
            if (cardActive === '2') {
              setCardActive('')
            } else {
              setCardActive('2')
            }
          }}>
          <span> {getFilteredCount(n => n.notiDetail.split('/')[0].substring(0, 5) === 'PROBE' && n.notiDetail.split('/')[2].substring(0, 5) === 'ON')}</span>
          <span>Door</span>
        </div>
        <div className={`card ${cardActive === '3' && 'active'}`}
          onClick={() => {
            if (cardActive === '3') {
              setCardActive('')
            } else {
              setCardActive('3')
            }
          }}>
          <span> {getSum('log')}</span>
          <span>Connect</span>
        </div>
      </div>
      <div>
        <div>
          <DataTable
            data={newFilter}
            columns={columns}
            expandableRows
            expandOnRowClicked
            expandableRowsComponent={ExpandedComponent}
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 40, 60, 80, 100]}
            pagination
            responsive
            fixedHeader
            fixedHeaderScrollHeight="calc(100dvh - 350px)"
          />
          <Modal show={show} onHide={closeModal}>
            <Modal.Header>
              <h1>Test</h1>
            </Modal.Header>
            <Modal.Body>
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum autem sint, delectus nulla soluta aliquam repellat tenetur sed quod consectetur, asperiores accusantium! Qui, temporibus odit. Neque velit provident impedit magni quam molestiae, fugiat aperiam aut quibusdam dolor fuga, eligendi necessitatibus sit mollitia nesciunt eius consectetur ducimus corrupti eveniet et quia.
              </span>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={closeModal}>Close</button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default Test