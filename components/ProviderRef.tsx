export default function ProviderRef(props) {
  return (
    <span>
      {props.providerID} | <a href={`https://filfox.info/en/address/${props.providerID}`} target='_blank'>filfox</a>
    </span>
  )
}