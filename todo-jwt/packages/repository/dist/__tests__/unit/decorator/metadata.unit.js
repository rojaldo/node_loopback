"use strict";
// Copyright IBM Corp. and LoopBack contributors 2019,2020. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../..");
describe('Repository', () => {
    describe('getAllClassMetadata', () => {
        class Oops {
        }
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", String)
        ], Oops.prototype, "oopsie", void 0);
        let Colour = class Colour {
        };
        tslib_1.__decorate([
            (0, __1.property)({}),
            tslib_1.__metadata("design:type", String)
        ], Colour.prototype, "rgb", void 0);
        Colour = tslib_1.__decorate([
            (0, __1.model)()
        ], Colour);
        let Widget = class Widget {
        };
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", Number)
        ], Widget.prototype, "id", void 0);
        tslib_1.__decorate([
            __1.property.array(Colour),
            tslib_1.__metadata("design:type", Array)
        ], Widget.prototype, "colours", void 0);
        Widget = tslib_1.__decorate([
            (0, __1.model)()
        ], Widget);
        let Samoflange = class Samoflange {
        };
        Samoflange = tslib_1.__decorate([
            (0, __1.model)()
        ], Samoflange);
        let Phlange = class Phlange {
        };
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", Number)
        ], Phlange.prototype, "id", void 0);
        tslib_1.__decorate([
            (0, __1.property)(),
            tslib_1.__metadata("design:type", Boolean)
        ], Phlange.prototype, "canFlap", void 0);
        tslib_1.__decorate([
            __1.property.array(Colour),
            tslib_1.__metadata("design:type", Array)
        ], Phlange.prototype, "colours", void 0);
        Phlange = tslib_1.__decorate([
            (0, __1.model)()
        ], Phlange);
        it('returns empty object for classes without @model', () => {
            const meta = __1.ModelMetadataHelper.getModelMetadata(Oops);
            (0, testlab_1.expect)(meta).to.deepEqual({});
        });
        it('retrieves metadata for classes with @model', () => {
            const meta = __1.ModelMetadataHelper.getModelMetadata(Samoflange);
            (0, testlab_1.expect)(meta).to.deepEqual(new __1.ModelDefinition({
                name: 'Samoflange',
                properties: {},
                settings: new Map(),
            }));
        });
        it('retrieves metadata for classes with @model and @property', () => {
            const meta = __1.ModelMetadataHelper.getModelMetadata(Widget);
            (0, testlab_1.expect)(meta).to.deepEqual(new __1.ModelDefinition({
                properties: {
                    id: {
                        type: Number,
                    },
                    colours: {
                        type: Array,
                        itemType: Colour,
                    },
                },
                settings: new Map(),
                name: 'Widget',
            }));
        });
        it('returns cached metadata instead of recreating it', () => {
            const classMeta = core_1.MetadataInspector.getClassMetadata(__1.MODEL_KEY, Phlange);
            classMeta.properties = {
                foo: {
                    type: String,
                },
            };
            // Intentionally change the metadata to be different from the Phlange
            // class metadata
            core_1.MetadataInspector.defineMetadata(__1.MODEL_WITH_PROPERTIES_KEY.key, classMeta, Phlange);
            const meta = __1.ModelMetadataHelper.getModelMetadata(Phlange);
            (0, testlab_1.expect)(meta.properties).to.eql(classMeta.properties);
        });
    });
});
//# sourceMappingURL=metadata.unit.js.map