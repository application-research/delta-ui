export default function WalletRef(props) {
  return (
    <span>
      {props.address} <a href={`https://filfox.info/en/address/${props.address}`} target='_blank'>filfox</a>
    </span>
  )
}