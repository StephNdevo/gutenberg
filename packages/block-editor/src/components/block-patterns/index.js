/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo, useCallback } from '@wordpress/element';
import { parse, cloneBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { ENTER, SPACE } from '@wordpress/keycodes';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockPreview from '../block-preview';
import useAsyncList from './use-async-list';

function BlockPattern( { pattern, onClick } ) {
	const { title, content } = pattern;
	const blocks = useMemo( () => parse( content ), [ content ] );

	return (
		<div
			className="block-editor-patterns__item"
			role="button"
			onClick={ () => onClick( pattern, blocks ) }
			onKeyDown={ ( event ) => {
				if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
					onClick( blocks );
				}
			} }
			tabIndex={ 0 }
		>
			<div className="block-editor-patterns__item-preview">
				<BlockPreview blocks={ blocks } __experimentalPadding={ 8 } />
			</div>
			<div className="block-editor-patterns__item-title">{ title }</div>
		</div>
	);
}

function BlockPatternPlaceholder( { pattern } ) {
	const { title } = pattern;

	return (
		<div className="block-editor-patterns__item is-placeholder">
			<div className="block-editor-patterns__item-preview"></div>
			<div className="block-editor-patterns__item-title">{ title }</div>
		</div>
	);
}

function BlockPatterns( { patterns } ) {
	const currentShownPatterns = useAsyncList( patterns );
	const getBlockInsertionPoint = useSelect( ( select ) => {
		return select( 'core/block-editor' ).getBlockInsertionPoint;
	} );
	const { insertBlocks } = useDispatch( 'core/block-editor' );
	const { createSuccessNotice } = useDispatch( 'core/notices' );
	const onClickPattern = useCallback( ( pattern, blocks ) => {
		const { index, rootClientId } = getBlockInsertionPoint();
		insertBlocks(
			map( blocks, ( block ) => cloneBlock( block ) ),
			index,
			rootClientId,
			false
		);
		createSuccessNotice(
			sprintf(
				/* translators: %s: block pattern title. */
				__( 'Pattern "%s" inserted.' ),
				pattern.title
			),
			{
				type: 'snackbar',
			}
		);
	}, [] );

	return (
		<div className="block-editor-patterns">
			{ patterns.map( ( pattern, index ) =>
				currentShownPatterns[ index ] === pattern ? (
					<BlockPattern
						key={ index }
						pattern={ pattern }
						onClick={ onClickPattern }
					/>
				) : (
					<BlockPatternPlaceholder
						key={ index }
						pattern={ pattern }
					/>
				)
			) }
		</div>
	);
}

export default BlockPatterns;
