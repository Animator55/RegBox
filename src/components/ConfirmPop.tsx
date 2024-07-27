type Props = { 
    title: string,
    subTitle: string,
    close: Function,
    confirm: Function,
}

export default function ConfirmPop({ title, subTitle, confirm, close }: Props) {
    return <section className='back-blur confirm-spefic' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur confirm-spefic") close()
    }}>
        <section className='pop confirm-pop'>
            <h2>{title}</h2>
            <p>{subTitle}</p>
            <hr></hr>
            <div className='buttons-confirm'>
                <button className="default-button" onClick={()=>{confirm()}}>Si</button>
                <button className="secondary-button" onClick={()=>{close()}}>No</button>
            </div>
        </section>
    </section>
}