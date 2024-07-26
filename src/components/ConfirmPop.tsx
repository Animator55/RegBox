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
        <section className='pop confirm-pop'>
            <h2>{title}</h2>
            <p>No se podrá editar, solo imprimir.</p>
            <hr></hr>
            <div className='buttons-confirm'>
                <button className="secondary-button" onClick={()=>{close()}}>No</button>
                <button className="default-button" onClick={()=>{confirm()}}>Si</button>
            </div>
        </section>
    </section>
}