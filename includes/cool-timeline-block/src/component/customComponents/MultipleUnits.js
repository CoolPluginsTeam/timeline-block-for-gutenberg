/**
 * External dependencies
 */
import './styling.scss';
import { __, sprintf } from '@wordpress/i18n';
import { ButtonGroup, Button, Tooltip } from '@wordpress/components';
import { useState } from '@wordpress/element';

const SpacingControl = ( props ) => {
	const responsive = true;
	let [settingsapply,updateSettingsapply]=useState('');
	const {
		label,
		unit,
		disableUnits,
		valueBottom,
		valueLeft,
		valueRight,
		valueTop,
		link,
		setAttributes,
	} = props;

	const onChangeUnits = ( value ) => {
			setAttributes( { [ unit.label ]: value.unitValue } );
	};
	const changeLinkedValues = ( newValue ) => {
				setAttributes( { [ valueTop.label ]: newValue } );
				setAttributes( { [ valueRight.label ]: newValue } );
				setAttributes( { [ valueBottom.label ]: newValue } );
				setAttributes( { [ valueLeft.label ]: newValue } );
				valueupdate(newValue);
            };
            const onChangeTopValue = ( event, value = '', resetLink = false ) => {
				let newValue = value;
				if ( '' === value && '' !== event ) {
					
					newValue =
					event.target.value === ''
					? 0
					: Number( event.target.value );
				}
				valueupdate(newValue,valueRight.value,valueBottom.value,valueLeft.value);
		if ( ! resetLink ) {
			if ( link.value ) {
				changeLinkedValues( newValue );
			} else{
				changedUnLinkedValues( );
			}
		}
		setAttributes( { [ valueTop.label ]: newValue } );
    };
    const changedUnLinkedValues = (  ) => {
                setAttributes( { [ valueTop.label ]: ( '' === valueTop.value || undefined === valueTop.value ) ? 0 : valueTop.value  } );
                setAttributes( { [ valueRight.label ]: ( '' === valueRight.value || undefined === valueRight.value ) ? 0 : valueRight.value  } );
                setAttributes( { [ valueBottom.label ]: ( '' === valueBottom.value || undefined === valueBottom.value ) ? 0 : valueBottom.value  } );
                setAttributes( { [ valueLeft.label ]: ( '' === valueLeft.value || undefined === valueLeft.value ) ? 0 : valueLeft.value  } );
    };
	const onChangeRightValue = ( event, value = '', resetLink = false ) => {
		let newValue = value;
		
		if ( '' === value && '' !== event ) {
			newValue =
			event.target.value === ''
			? 0
					: Number( event.target.value );
		}
		valueupdate(valueTop.value,newValue,valueBottom.value,valueLeft.value);
		if ( ! resetLink ) {
			if ( link.value ) {
				changeLinkedValues( newValue );
			}else {
				changedUnLinkedValues( );
			}
		}

		setAttributes( { [ valueRight.label ]: newValue } );
	};

	const onChangeBottomValue = ( event, value = '', resetLink = false ) => {
		let newValue = value;
		
		if ( '' === value && '' !== event ) {
			newValue =
				event.target.value === ''
				? 0
					: Number( event.target.value );
		}
		valueupdate(valueTop.value,valueRight.value,newValue,valueLeft.value);
		if ( ! resetLink ) {
			if ( link.value ) {
				changeLinkedValues( newValue );
			}else {
				changedUnLinkedValues( );
			}
		}
		setAttributes( { [ valueBottom.label ]: newValue } );
	};

	const onChangeLeftValue = ( event, value = '', resetLink = false ) => {
		let newValue = value;
		
		if ( '' === value && '' !== event ) {
			newValue =
			event.target.value === ''
			? 0
			: Number( event.target.value );
		}
		valueupdate(valueTop.value,valueRight.value,valueBottom.value,newValue);
		if ( ! resetLink ) {
		if ( link.value && ! resetLink ) {
				changeLinkedValues( newValue );
			}else {
				changedUnLinkedValues( );
			}
		}
		setAttributes( { [ valueLeft.label ]: newValue } );
	};

	let unitSizes = [
		{
			name: __( 'Pixel', 'timeline-block' ),
			unitValue: 'px',
		},
		{
			name: __( 'Em', 'timeline-block' ),
			unitValue: 'em',
		},
		{
			name: __( '%', 'timeline-block' ),
			unitValue: '%',
		},
	];
	if ( props.units ) {
		unitSizes = props.units;
	}

	const onUnitSizeClick = ( uSizes ) => {
		const items = [];
		uSizes.map( ( key ) =>{
			items.push(
				<Tooltip
					key={key.name}
					text={ sprintf(
						/* translators: abbreviation for units */
						__( '%s units', 'timeline-block' ),
						key.name
					) }
				>
					<Button
						key={ key.unitValue }
						className={ 'timeline-block-range-control__units--' + key.name }
						isSmall
						isPrimary={
							( unit.value === key.unitValue )
						}
						isSecondary={
							unit.value !== key.unitValue
						}
						aria-pressed={
							( unit.value === key.unitValue )
						}
						aria-label={ sprintf(
							/* translators: abbreviation for units */
							__( '%s units', 'timeline-block' ),
							key.name
						) }
						onClick={ () => onChangeUnits( key ) }
					>
						{ key.unitValue }
					</Button>
				</Tooltip>
			)
		});

		return items;
	};

	let linkHtml = '';

	if ( link ) {
		linkHtml = (
			<span // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
				className="cp-timeline-block_control__link timeline-block-spacing-control-connected dashicons dashicons-admin-links "
				onClick={ () => {
					changedUnLinkedValues( );
					setAttributes( { [ link.label ]: false } );
				} }
			></span>
		);

		if ( ! link.value ) {
			linkHtml = (
				<span // eslint-disable-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
					className="cp-timeline-block_control__link timeline-block-spacing-control-disconnected dashicons dashicons-editor-unlink"
					onClick={ () => {
						onLinkClickHandler();
						setAttributes( { [ link.label ]: true } );
					} }
				></span>
			);
		}
	}
	const onLinkClickHandler = () => {
		let linkValue;
		linkValue = valueTop.value;
		changeLinkedValues( linkValue );
	};
	const [ labelTop, labelRight, labelBottom, labelLeft ] = props.labels || [
		__( 'Top', 'timeline-block' ),
		__( 'Right', 'timeline-block' ),
		__( 'Btm', 'timeline-block' ),
		__( 'Left', 'timeline-block' ),
	];
	const defaultValue = props.defaultValue !== undefined ? props.defaultValue : '0';
	const output = {};
	output.Desktop = (
		<div className="timeline-block-spacing-control__grid">
			<div className="timeline-block-spacing-control__cell">
				<input
					className="cp-block-timeline-number_control top"
					type="number"
					placeholder="-"
					onChange={ ( e ) => onChangeTopValue( e ) }
					value={ ( '' !== valueTop.value ) ? valueTop.value : defaultValue }
					/>
				<span className="cp-block-timeline-number_control-label">{ labelTop }</span>
			</div>
			<div className="timeline-block-spacing-control__cell">
				<input
					className="cp-block-timeline-number_control right"
					type="number"
					placeholder="-"
					onChange={ ( e ) => onChangeRightValue( e ) }
					value={ ( '' !== valueRight.value ) ? valueRight.value : defaultValue }
				/>
				<span className="cp-block-timeline-number_control-label">{ labelRight }</span>
			</div>
			<div className="timeline-block-spacing-control__cell">
				<input
					className="cp-block-timeline-number_control bottom"
					type="number"
					placeholder="-"
					onChange={ ( e ) => onChangeBottomValue( e ) }
					value={ ( '' !== valueBottom.value ) ? valueBottom.value : defaultValue }
					/>
				<span className="cp-block-timeline-number_control-label">{ labelBottom }</span>
			</div>
			<div className="timeline-block-spacing-control__cell">
				<input
					className="cp-block-timeline-number_control left"
					type="number"
					placeholder="-"
					onChange={ ( e ) => onChangeLeftValue( e ) }
					value={ ( '' !== valueLeft.value ) ? valueLeft.value : defaultValue }
					/>
				<span className="cp-block-timeline-number_control-label">{ labelLeft }</span>
			</div>
			<div className="timeline-block-spacing-control__link-cell">{ linkHtml }</div>
		</div>
	);
	const resetValues = (  ) => {
		onChangeTopValue( '', '', true );
		onChangeRightValue( '', '', true );
				onChangeBottomValue( '', '', true );
				onChangeLeftValue( '', '', true );
				setAttributes( { [ unit?.label ]: 'px' } );
				setAttributes( { [ link.label ]: false } );
				valueupdate('');
	};
	const valueupdate=(...value)=>{
		for(let i=0; i<value.length; i++){
			if(value[i] !== 0){
				updateSettingsapply('timeline-container_pd_apply');
				break;
			}else{
				updateSettingsapply('');
			}
		}
	};
	return (
		<div className="components-base-control timeline-block-spacing-control">
			<div className="timeline-block-size-type-field-tabs">
				<div className="timeline-block-control__header">
					<div className="timeline-block-control__actions">
                    <h2 className='timeline-block-control__actions_label'>{label}</h2>
						<Button
                        type='button'
                        onClick={()=>{resetValues()}}
                        className={`timeline-block-control__actions_reset${settingsapply != '' ? ' '+settingsapply : ' '}`}
                        isSmall
                        ><span className="dashicons dashicons-image-rotate"></span></Button>
						<ButtonGroup
							className="timeline-block-control__units"
							aria-label={ __(
								'Select Units',
								'timeline-block'
								) }
								>
							{ !disableUnits && onUnitSizeClick( unitSizes ) }
						</ButtonGroup>
					</div>
				</div>
                { output.Desktop }
			</div>
		</div>
	);

};

export default SpacingControl;