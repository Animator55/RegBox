type Props = { 
    title: string,
    close: Function,
    confirm: Function,
}

export default function ConfirmPop({ title, confirm, close }: Props) {
    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop'>
            <h2>{title}</h2>
            <hr></hr>
            <div className='buttons-confirm'>
                <button className="default-button" onClick={()=>{confirm()}}>Si</button>
                <button className="secondary-button" onClick={()=>{close()}}>No</button>
            </div>
        </section>
    </section>
}