import { IconPickerItem } from "../component/Icons/index.js";
import TimelineSettingsLink from './timeline-settings-link.js';
import { openProUpgrade } from '../component/ProFeature.js';
import StorySettingsPanel from '../component/storySettings/StorySettingsPanel.js';
const { Component, Fragment } = wp.element;
import { __ } from '@wordpress/i18n';

const { RichText, InspectorControls,  BlockControls, InnerBlocks } = wp.blockEditor;

const {
	dispatch,
	select,
} = wp.data;

const {
	Button,
	CardBody,
	ToolbarGroup,
	ToolbarButton,
} = wp.components;

// Inline icons: the dashicons font is not loaded inside the editor canvas of this plugin.
const TOOLBAR_ICONS = {
	image: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z',
	video: 'M18.7 3H5.3C4 3 3 4 3 5.3v13.4C3 20 4 21 5.3 21h13.4c1.3 0 2.3-1 2.3-2.3V5.3C21 4 20 3 18.7 3zm.8 15.7c0 .4-.4.8-.8.8H5.3c-.4 0-.8-.4-.8-.8V5.3c0-.4.4-.8.8-.8h13.4c.4 0 .8.4.8.8v13.4zM10 15l5-3-5-3v6z',
	gallery: 'M16.375 4.5H4.625a.125.125 0 0 0-.125.125v8.254l2.859-1.54a.75.75 0 0 1 .68-.016l2.384 1.142 2.89-2.074a.75.75 0 0 1 .874 0l2.313 1.66V4.625a.125.125 0 0 0-.125-.125Zm.125 9.398-2.75-1.975-2.813 2.02a.75.75 0 0 1-.76.067l-2.444-1.17L4.5 14.583v1.792c0 .069.056.125.125.125h11.75a.125.125 0 0 0 .125-.125v-2.477ZM4.625 3C3.728 3 3 3.728 3 4.625v11.75C3 17.272 3.728 18 4.625 18h11.75c.897 0 1.625-.728 1.625-1.625V4.625C18 3.728 17.272 3 16.375 3H4.625ZM20 8v11c0 .69-.31 1-.999 1H6v1.5h13.001c1.52 0 2.499-.982 2.499-2.5V8H20Z',
	trash: 'M20 5h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v1H4v1.5h1l.8 12.4c.1 1.1 1 1.9 2 1.9h8.4c1 0 1.9-.8 2-1.9L19 6.5h1V5zM10.5 4c0-.3.2-.5.5-.5h2c.3 0 .5.2.5.5v1h-3V4zm6.4 14.8c0 .3-.2.5-.5.5H7.6c-.3 0-.5-.2-.5-.5L6.4 6.5h11.2l-.7 12.3z',
};
const ToolbarIcon = ({ name }) => (
	<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false">
		<path d={TOOLBAR_ICONS[name]} />
	</svg>
);

class Edit extends Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
	}
	componentDidMount() {
		//Store client id.
		this.props.setAttributes( { block_id: this.props.clientId } )
		this.props.setAttributes( { wodpressBlock: true } )
		const wordpressBlock=this.props.attributes.wodpressBlock;
		const mediaBlock=!['none',''].includes(this.props.attributes.timeLineImage);
		!wordpressBlock && this.innerBlockTemplate(mediaBlock);
   }	

   addBlock(e){
	   const parentBlockId = select( 'core/block-editor' ).getBlockHierarchyRootClientId( this.props.clientId );
	   const parentAttribute=select('core/block-editor').getBlockAttributes( parentBlockId );
	   let position='one-sided' === parentAttribute.timelineDesign ? parentAttribute.Orientation : 'left' === this.props.attributes.blockPosition ? 'right' : 'left';
	   let index = select('core/block-editor').getBlockIndex(this.props.clientId);
	   let timelineDesign= parentAttribute.timelineDesign
	   let timelineLayout= parentAttribute.timelineLayout
	   let name = 'cp-timeline/content-timeline-block-child';
	   let insertedBlock = wp.blocks.createBlock(name, {block_position_active:false,
	   timelineDesign :timelineDesign,
	   timelineLayout:timelineLayout,
	   blockPosition: position,
	   storyPositionHide: !parentAttribute.OrientationCheckBox,
	   headingTag: parentAttribute.headingTag
		});

	   wp.data.dispatch('core/block-editor').insertBlocks(insertedBlock,index+1,parentBlockId);
	   this.UpdateOrientation();
   }

	UpdateOrientation() {
		const parentBlockId = select( 'core/block-editor' ).getBlockHierarchyRootClientId( this.props.clientId );
		const parentAttribute=select('core/block-editor').getBlockAttributes( parentBlockId );
		
		if (parentAttribute.timelineLayout == "vertical" && parentAttribute.timelineDesign == "both-sided") {
			const currentIndex = select('core/block-editor').getBlockIndex(this.props.clientId);
			const currentBlockPostion ='left' === this.props.attributes.blockPosition ? 'right' : 'left';
			const parentBlock = select("core/block-editor").getBlock(parentBlockId);
			const innerBlocks = parentBlock.innerBlocks;
			const currentPostion=currentIndex % 2;
			innerBlocks.forEach((block, index) => {
				if(index > (currentIndex + 1)){
					const blockpostion=index % 2 !== currentPostion ? currentBlockPostion : this.props.attributes.blockPosition;
					block.attributes.blockPosition = blockpostion, block.attributes.storyPositionHide=!parentAttribute.OrientationCheckBox
				}
			});
		}
	}

	innerBlockTemplate(mediaBlock){
		const newBlocks=[];
		const mediaBlocks=[];
		let oldBlocks=[];
		let innerBlocks;
		const prevInnerBlock = select('core/block-editor').getBlock(this.props.clientId)?.innerBlocks;
		const prevBlocksName=prevInnerBlock.map((data)=>{
			return data.name;
		});
		let mediaIndex = prevBlocksName.findIndex((data) => ['core/image'].includes(data));
		mediaIndex = mediaIndex < 0 ? 0 : mediaIndex;

		const prevMediaBlock=prevInnerBlock.filter((data)=>{
			return ['core/image'].includes(data.name);
		});
		
		const headingLevel=()=>{
			const headingLevel=parseInt(this.props.attributes.headingTag.replace('h',''));
			return headingLevel;
		}
		
		//  retrieve attributes of old paragraph and heading blocks
		prevInnerBlock && Array.prototype.map.call(prevInnerBlock,(block)=>{
			if(['core/paragraph','core/heading'].includes(block.name)){
				oldBlocks.push([block.name, block.attributes ]);
			};
		})
		// filter out undefined blocks from oldBlocks
		oldBlocks = Array.prototype.filter.call(oldBlocks,(block)=>{
			return undefined !==  block;
		})
		
		// The legacy design zeroes the story text blocks' padding inline; the new design sets its own spacing.
		const isNewDesign = typeof cgbGlobal !== 'undefined' && !! cgbGlobal.isNewDesign;
		const legacySpacing = isNewDesign ? {} : { style: { spacing: { padding: { top: '0px', left: '0px', bottom: '0px', right: '0px' } } } };

		// Add media block inside the mediaBlocks.
		const imageUrl='none' === this.props.attributes.timeLineImage ? '' : this.props.attributes.timeLineImage;
		mediaBlock && mediaBlocks.push(['core/image', { url: imageUrl, className: 'ctlb-block-image',aspectRatio: "4/3", scale: "cover", }]); // Default: Image block with a default image URL
		newBlocks.push(
			['core/heading', { level: headingLevel(), content: this.props.attributes.time_heading, className: 'ctlb-block-title', ...legacySpacing}], // Default: Heading block with level 2 and default content
			['core/paragraph', { content: this.props.attributes.time_desc, placeholder: __('Add your description here','timeline-block'), className: 'ctlb-block-desc', ...legacySpacing}], // Default: Paragraph block with default content
		);

		
		if(prevMediaBlock.length > 0 && !mediaBlock){
			dispatch('core/block-editor').removeBlock(prevInnerBlock[mediaIndex].clientId, true)
		}else if(mediaBlock && prevBlocksName.length > 0 && !prevBlocksName.includes('core/image')){
			const insertedBlock = wp.blocks.createBlock(mediaBlocks[0][0], mediaBlocks[0][1]);
			dispatch('core/block-editor').insertBlocks(insertedBlock, 0, this.props.clientId)
		}


		// Spread all blocks in innerBlocks.
		if(oldBlocks && oldBlocks.length > 0){
			innerBlocks=[...mediaBlocks,...oldBlocks];
		}else{
			innerBlocks=[...mediaBlocks,...newBlocks];
		}

		this.props.setAttributes({innerBlockTemplate: innerBlocks, mediaBlock: mediaBlock});
	}

	render() {
		// Setup the attributes.
		const {
			setAttributes,
			attributes: {
				icon,
				t_date,
				iconToggle,
				iconColor,
				blockPosition,
				storyPositionHide,
				mediaBlock,
				innerBlockTemplate
			},
			context: {
				'cp-timeline/timelineDesign': timelineDesign,
				'cp-timeline/timelineLayout': timelineLayout,
			}
		} = this.props;
		// Add the image block (first press on "Image") and select it so it can be edited right away.
		const addMediaBlock = () => {
			this.innerBlockTemplate(true);
			setTimeout(() => {
				const mediaBlockId = select('core/block-editor').getBlock(this.props.clientId).innerBlocks[0].clientId;
				wp.data.dispatch('core/block-editor').selectBlock(mediaBlockId);
			}, 50);
		};
		const StoryDetail = () => (
			<div className="story-details">
				<div className={`story-content${mediaBlock ? '' : ' is-empty'}`}>
					<div className="ctlb-media-toolbar" role="toolbar" aria-label={__('Media type', 'timeline-block')}>
						<Button
							className={`ctlb-media-toolbar__btn${mediaBlock ? ' is-active' : ''}`}
							label={__('Image', 'timeline-block')}
							showTooltip
							aria-pressed={!!mediaBlock}
							onClick={() => !mediaBlock && addMediaBlock()}
						>
							<ToolbarIcon name="image" />
						</Button>
						<Button
							className="ctlb-media-toolbar__btn ctlb-media-toolbar__btn--pro"
							label={__('Video (Pro)', 'timeline-block')}
							showTooltip
							onClick={openProUpgrade}
						>
							<ToolbarIcon name="video" />
						</Button>
						<Button
							className="ctlb-media-toolbar__btn ctlb-media-toolbar__btn--pro"
							label={__('Gallery (Pro)', 'timeline-block')}
							showTooltip
							onClick={openProUpgrade}
						>
							<ToolbarIcon name="gallery" />
						</Button>
						{mediaBlock && (
							<>
								<span className="ctlb-media-toolbar__divider" aria-hidden="true"></span>
								<Button
									className="ctlb-media-toolbar__btn ctlb-media-toolbar__btn--remove"
									label={__('Remove media', 'timeline-block')}
									showTooltip
									onClick={() => this.innerBlockTemplate(false)}
								>
									<ToolbarIcon name="trash" />
								</Button>
							</>
						)}
					</div>
					<InnerBlocks
						template={innerBlockTemplate}
						allowedBlocks={['core/image', 'core/heading', 'core/paragraph', 'core/list','core/buttons']}
						/>
				</div>
			</div>
		);

		const StoryTime = () => (
			<RichText
				tagName="p"
				placeholder={__('Date/Steps', 'timeline-block')}
				value={t_date === 'ctl_date_undefined' ? '' : t_date} // Change undefined to an empty string for controlled input
				onChange={ ( value ) => {
					const date='' === value ? 'ctl_date_undefined' : value;
					setAttributes({t_date: date });
				}}
			/>
		);

		const content_control = (
			<InspectorControls>
				<div className="cooltimeline-tab-settings ctlb-child-settings">
					<TimelineSettingsLink clientId={this.props.clientId} />
					<CardBody>
						<div className="ctlb-style-element-card ctlb-general-card">
							<StorySettingsPanel
								collapsible={false}
								attributes={this.props.attributes}
								setAttributes={setAttributes}
								clientId={this.props.clientId}
							/>
						</div>
					</CardBody>
				</div>
			</InspectorControls>
		);
		const icon_div = <div className="timeline-block-icon">
			{icon !== "" && iconToggle == "true" ? <span className="timeline-block-render-icon" >
				<IconPickerItem icon={icon} size={24} color={iconColor} />
				</span> : <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path></svg>}
		</div>;
		return (
			<Fragment>
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							label="Delete Block"
							icon="trash"
							onClick={() => dispatch('core/block-editor').removeBlock(this.props.clientId, true)}
						/>
					</ToolbarGroup>
					<ToolbarGroup >
						<ToolbarButton
							label="Add Block"
							icon="plus"
							onClick={() => 	
								this.addBlock()
							}
						/>
					</ToolbarGroup>
				</BlockControls>
				{content_control}
				<div className={"timeline-content icon-" + iconToggle + ""} ref={this.myRef} >
					<div className={`timeline-block-timeline ctl-row  position-${blockPosition}${t_date == '' ? ' ctl_timeFalse' : ''}`}>
						<div className="ctl-6 timeline-block-time">
							<div className="story-time">
								{StoryTime()}
							</div>
						</div>
						{icon_div}
						<div className="ctl-6 timeline-block-detail">
							{StoryDetail()}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps){
		const childBlocks=select("core/block-editor").getBlock(this.props.clientId)?.innerBlocks;
		if(childBlocks){
			const paragraphBlock=childBlocks.filter(block=>{ return "core/paragraph" === block.name })[0];
			const paragraphBlockId=paragraphBlock?.clientId;
			const selectBlockId=select('core/block-editor').getSelectedBlockClientId();
			if(selectBlockId){
				if(paragraphBlockId === selectBlockId){
					this.paragraphToolBarPosition(selectBlockId);
				}
			}
		}

	}

	paragraphToolBarPosition(id){
		// Getting the root element for that is a overflow Y axis auto
		const getParentOverflowElement = (parentElement) => {
			let element = parentElement;
			while (element) {
				const { overflowY } = getComputedStyle(element);
				if (overflowY !== "auto") {
					element = element.parentElement;
				} else {
					return element;
				}
			}
			return element;
		};

		setTimeout(() => {
			const parentBlockId = select('core/block-editor').getBlockHierarchyRootClientId(this.props.clientId);
			const iframe = document.querySelector('iframe[name="editor-canvas"]');

			const doc =
				this.myRef?.current?.ownerDocument ||
				iframe?.contentDocument ||
				document;
				const paragraphBlock =
				doc.querySelector(`[data-block="${id}"]`) ||
				doc.querySelector(`#block-${id}`);
			if (!paragraphBlock) {
				return;
			}	
			const parentBlock =
			paragraphBlock.closest(`[data-block="${parentBlockId}"]`) ||
			paragraphBlock.closest(`#block-${parentBlockId}`);
			const scrollElement = getParentOverflowElement(parentBlock);
			const paragraphToolbar = doc.querySelector("div.components-popover");
			if (paragraphToolbar) {

				const toolStyleValue = paragraphToolbar?.style?.transform;

				// Get Toolbar updated transform position.
				const updatedValue = () => {
					const paragraphBlock =
					doc.querySelector(`[data-block="${id}"]`) ||
					doc.querySelector(`#block-${id}`);
				if (!paragraphBlock) {
					return 0;
				}
				const paragraphStyle = getComputedStyle(paragraphBlock),
					scrollTop = scrollElement.scrollTop,
					rect = paragraphBlock.getBoundingClientRect(),
					paragraphBlockYAxis = 0 > rect.top ? -Math.abs(rect.top) : Math.abs(rect.top),
					paragraphTopSpacing = parseInt(paragraphStyle.marginTop.match(/\d+\.\d+|\d+/g)[0]),
					toolbarParentOffsetTop = paragraphToolbar.offsetParent?.offsetTop ?? 0,
					parentYPosition = Math.floor(scrollTop + paragraphBlockYAxis + paragraphBlock.clientHeight - paragraphTopSpacing - paragraphToolbar.clientHeight - toolbarParentOffsetTop + 40);
					return parentYPosition;
				};

				// Update ToolBar transform position.
				const updateToolBarStyle = (newTranslateY) => {
					if (toolStyleValue) {
						const style = toolStyleValue.replace(
							/translateY\(\d+px\)/,
							`translateY(${newTranslateY}px)`
						);
						paragraphToolbar.style.transform = style;
					}
				};

				// ToolBar Observer.
				const observerCallback = (mutationsList) => {
					const selectBlockId = select('core/editor').getSelectedBlockClientId();
					if (selectBlockId === id) {
						for (const mutation of mutationsList) {
							if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
								const currentToolBarValue = doc.querySelector("div.components-popover");
								const currentTranslateY = getTranslateYValue(
									currentToolBarValue?.style?.transform
								);
								const updateValue = updatedValue();
								if (updateValue > currentTranslateY) {
									// update toolbar position
									updateToolBarStyle(updateValue);
								}
							}
						}
					}
				};

				const observerConfig = { attributes: true };
				const observer = new MutationObserver(observerCallback);
				// Observer toolBar transform position
				observer.observe(paragraphToolbar, observerConfig);

				// update toolbar position.
				updateToolBarStyle(updatedValue());

				// Function to extract translateY value from a transform string.
				function getTranslateYValue(transform) {
					const match = transform.match(/translateY\(([-+]?\d+)px\)/);
					return match ? parseInt(match[1]) : 0;
				}
			}
		}, 10);
	}
}

export default Edit;
