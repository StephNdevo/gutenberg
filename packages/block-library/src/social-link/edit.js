/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	URLPopover,
	URLInput,
} from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { keyboardReturn } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { getIconBySite, getNameBySite } from './social-list';

const SocialLinkEdit = ( { attributes, setAttributes, isSelected } ) => {
	const { url, service, label } = attributes;
	const [ showURLPopover, setPopover ] = useState( false );
	const classes = classNames( 'wp-social-link', 'wp-social-link-' + service, {
		'wp-social-link__is-incomplete': ! url,
	} );

	// Disable reason: The rule is currently not considering use as JSX tagName.
	//
	// See: https://github.com/WordPress/gutenberg/issues/16418

	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const IconComponent = getIconBySite( service );
	const socialLinkName = getNameBySite( service );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ sprintf(
						/* translators: %s: name of the social service. */
						__( '%s label' ),
						socialLinkName
					) }
					initialOpen={ false }
				>
					<PanelRow>
						<TextControl
							label={ __( 'Link label' ) }
							help={ __(
								'Briefly describe the link to help screen reader users.'
							) }
							value={ label }
							onChange={ ( value ) =>
								setAttributes( { label: value } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<Button className={ classes } onClick={ () => setPopover( true ) }>
				<IconComponent />
				{ isSelected && showURLPopover && (
					<URLPopover onClose={ () => setPopover( false ) }>
						<form
							className="block-editor-url-popover__link-editor"
							onSubmit={ ( event ) => {
								event.preventDefault();
								setPopover( false );
							} }
						>
							<div className="block-editor-url-input">
								<URLInput
									value={ url }
									onChange={ ( nextURL ) =>
										setAttributes( { url: nextURL } )
									}
									placeholder={ __( 'Enter address' ) }
									disableSuggestions={ true }
								/>
							</div>
							<Button
								icon={ keyboardReturn }
								label={ __( 'Apply' ) }
								type="submit"
							/>
						</form>
					</URLPopover>
				) }
			</Button>
		</Fragment>
	);
};

export default SocialLinkEdit;
