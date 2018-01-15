/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import styles from '../../styles';
/**
 * Message component.
 * @returns {function}
 */
const Message = () => (<p className={styles.message}>{this.props.text}</p>);

export default Message;
